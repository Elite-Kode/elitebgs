import axios from 'axios'

const state = {
  factions: [],
  selectedFaction: {}
}
const getters = {
  friendlyFactions: (state) => {
    return state.factions.map(faction => {
      return {
        ...faction,
        government: titlify(faction.government),
        allegiance: titlify(faction.allegiance)
      }
    })
  },
  friendlyFaction: (state, getters) => {
    let faction = state.selectedFaction
    return {
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
}
const mutations = {
  setFactions (state, factions) {
    state.factions = factions
  },
  setSelectedFaction (state, faction) {
    state.selectedFaction = faction
  }
}
const actions = {
  async fetchFactions (context, { page, beginsWith }) {
    let response = await axios.get('/api/ebgs/v5/factions', { params: { page, minimal: true, beginsWith } })
    return response.data
  },
  async fetchFactionByEddbId (context, { eddbId }) {
    let response = await axios.get('/api/ebgs/v5/factions', { params: { eddbId, minimal: true } })
    return response.data
  },
  async fetchFactionWithHistoryById (context, { id, timeMin, timeMax }) {
    let response = await axios.get('/api/ebgs/v5/factions', {
      params: {
        id,
        timeMin,
        timeMax,
        systemDetails: true
      }
    })
    return response.data
  }
}

function titlify (title) {
  if (title) {
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
}

export default {
  state,
  getters,
  mutations,
  actions
}
