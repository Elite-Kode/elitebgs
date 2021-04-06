import axios from 'axios'

const state = {
  systems: [],
  selectedSystem: {}
}
const getters = {
  friendlySystems: (state, getters) => {
    return state.systems.map(system => {
      return {
        ...system,
        government: getters.government(system.government),
        allegiance: getters.superpower(system.allegiance),
        primary_economy: getters.economy(system.primary_economy),
        secondary_economy: system.secondary_economy ? getters.economy(system.secondary_economy) : '',
        state: getters.state(system.state)
      }
    })
  },
  friendlySystem: (state, getters) => {
    let system = state.selectedSystem
    return {
      ...system,
      government: getters.government(system.government),
      allegiance: getters.superpower(system.allegiance),
      primary_economy: getters.economy(system.primary_economy),
      secondary_economy: system.secondary_economy ? getters.economy(system.secondary_economy) : '',
      security: getters.security(system.security),
      state: getters.state(system.state),
      factions: system.factions.map(faction => {
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
}
const mutations = {
  setSystems (state, systems) {
    state.systems = systems
  },
  setSelectedSystem (state, system) {
    state.selectedSystem = system
  }
}
const actions = {
  async fetchSystems (context, { page, beginsWith }) {
    let response = await axios.get('/api/ebgs/v5/systems', { params: { page, minimal: true, beginsWith } })
    return response.data
  },
  async fetchSystemByEddbId (context, { eddbId }) {
    let response = await axios.get('/api/ebgs/v5/systems', { params: { eddbId, minimal: true } })
    return response.data
  },
  async fetchSystemWithHistoryById (context, { id, timeMin, timeMax }) {
    let response = await axios.get('/api/ebgs/v5/systems', {
      params: {
        id,
        timeMin,
        timeMax,
        factionDetails: true,
        factionHistory: true
      }
    })
    return response.data
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
