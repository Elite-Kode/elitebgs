import moment from 'moment'
import _isEmpty from 'lodash/isEmpty'

const getName = (state, id, key) => state.allIds[id]?.[key]?.name

const formatTime = time => ({
  ...time,
  time_formatted: moment(time.time).utc().format('HH:mm'),
  time_local: moment(time.time).format('HH:mm'),
  updated_at_formatted: formatDate(time.updated_at)
})

const formatDate = date => moment(date).utc().format('ddd, MMM D, HH:mm:ss')

const titlify = title => {
  let revised = title.charAt(0).toUpperCase()
  for (let i = 1; i < title.length; i++) {
    if (title.charAt(i - 1) === ' ') {
      revised += title.charAt(i).toUpperCase()
    } else {
      revised += title.charAt(i).toLowerCase()
    }
  }
  return revised
}

const formattedFaction = (faction, getters) => {
  return _isEmpty(faction) ? {} : {
    ...faction,
    government: titlify(faction.government),
    allegiance: titlify(faction.allegiance),
    faction_presence: faction.faction_presence?.map(system => {
      return {
        ...system,
        state: getters.state(system.state),
        happiness: system.happiness ? getters.happiness(system.happiness) : '',
        active_states: system.active_states.map(state => {
          return {
            ...state,
            state: getters.state(state.state)
          }
        }),
        pending_states: system.pending_states.map(state => {
          return {
            ...state,
            state: getters.state(state.state)
          }
        }),
        recovering_states: system.recovering_states.map(state => {
          return {
            ...state,
            state: getters.state(state.state)
          }
        }),
        conflicts: system.conflicts?.map(conflict => {
          return {
            ...conflict,
            system_id: system.system_id,
            system_name: system.system_name
          }
        }),
        controlling: system.system_details.controlling_minor_faction_id === faction._id
      }
    })
  }
}

const systemDetailsTable = (system, faction) => {
  return {
    ...system,
    controlling: system.system_details.controlling_minor_faction_id === faction._id ? '👑' : '',
    influence: system.influence * 100,
    name: system.system_name,
    population: system.system_details.population,
    system_id: system.system_id,
    from_now: moment(system.updated_at).fromNow(true),
    age_flag: getChipColour(-(moment().diff(moment(system.updated_at), 'days', true) - 1))
  }
}

const formattedSystem = (system, getters) => {
  return _isEmpty(system) ? {} : {
    ...system,
    government: getters.government(system.government),
    allegiance: getters.superpower(system.allegiance),
    primary_economy: getters.economy(system.primary_economy),
    secondary_economy: system.secondary_economy ? getters.economy(system.secondary_economy) : '',
    security: getters.security(system.security),
    state: getters.state(system.state),
    factions: system.factions?.map(faction => {
      return {
        ...faction,
        faction_details: {
          ...faction.faction_details,
          faction_presence: {
            ...faction.faction_details.faction_presence,
            state: getters.state(faction.faction_details.faction_presence.state),
            happiness: faction.faction_details.faction_presence.happiness ? getters.happiness(faction.faction_details.faction_presence.happiness) : '',
            active_states: faction.faction_details.faction_presence.active_states.map(state => {
              return {
                ...state,
                state: getters.state(state.state)
              }
            }),
            pending_states: faction.faction_details.faction_presence.pending_states.map(state => {
              return {
                ...state,
                state: getters.state(state.state)
              }
            }),
            recovering_states: faction.faction_details.faction_presence.recovering_states.map(state => {
              return {
                ...state,
                state: getters.state(state.state)
              }
            })
          }
        }
      }
    })
  }
}

const factionDetailsTable = (faction, system) => {
  return {
    ...faction.faction_details.faction_presence,
    is_controlling: faction.faction_id === system.controlling_minor_faction_id ? '👑' : '',
    influence: faction.faction_details.faction_presence.influence * 100,
    name: faction.name,
    faction_id: faction.faction_id,
    from_now: moment(faction.faction_details.faction_presence.updated_at).fromNow(true),
    age_flag: getChipColour(-(moment().diff(moment(faction.faction_details.faction_presence.updated_at), 'days', true) - 1))
  }
}

const getChipColour = value => {
  if (value === 0) {
    return 'info'
  } else if (value > 0) {
    return 'success'
  } else {
    return 'error'
  }
}

export {
  getName,
  formatTime,
  formatDate,
  titlify,
  formattedFaction,
  systemDetailsTable,
  formattedSystem,
  factionDetailsTable,
  getChipColour
}
