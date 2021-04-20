import axios from 'axios'
import { formattedSystem } from '@/store/helpers'

const state = {
  systems: [],
  selectedSystem: {}
}
const getters = {
  friendlySystems (state, getters) {
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
  friendlySystem (state, getters) {
    return formattedSystem(state.selectedSystem, getters)
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
