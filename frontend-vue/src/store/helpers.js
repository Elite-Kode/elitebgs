import moment from 'moment'
import _isEmpty from 'lodash/isEmpty'

const getName = (state, id, key) => state.allIds[id]?.[key]?.name

const formatTime = time => ({
  ...time,
  time_formatted: moment(time.time).utc().format('HH:mm'),
  time_local: moment(time.time).format('HH:mm'),
  updated_at_formatted: moment(time.updated_at).utc().format('ddd, MMM D, HH:mm:ss')
})

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

export {
  getName,
  formatTime,
  titlify,
  formattedFaction,
  formattedSystem
}
