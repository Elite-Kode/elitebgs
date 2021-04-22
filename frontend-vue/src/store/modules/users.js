import { formattedFaction, formattedSystem } from '@/store/helpers'
import axios from 'axios'

const state = {
  factions: [],
  systems: []
}
const getters = {
  friendlyUserFactions (state, getters) {
    return state.factions.map(faction => formattedFaction(faction, getters))
  },
  friendlyUserSystems (state, getters) {
    return state.systems.map(system => formattedSystem(system, getters))
  }
}
const mutations = {
  setUserFactions (state, factions) {
    state.factions = factions
  },
  setUserSystems (state, systems) {
    state.systems = systems
  }
}
const actions = {
  async saveUserFactions (context, factions) {
    let response = await axios.post('/auth/user/monitor/factions', { factions: factions.join() })
    return response.data
  },
  async saveUserSystems (context, systems) {
    let response = await axios.post('/auth/user/monitor/systems', { systems: systems.join() })
    return response.data
  },
  async saveUserStations (context, stations) {
    let response = await axios.post('/auth/user/monitor/stations', { stations: stations.join() })
    return response.data
  },
  async deleteUserFaction (context, faction) {
    let response = await axios.delete('/auth/user/monitor/factions', { params: { faction } })
    return response.data
  },
  async deleteUserSystem (context, system) {
    let response = await axios.delete('/auth/user/monitor/systems', { params: { system } })
    return response.data
  },
  async deleteUserStation (context, station) {
    let response = await axios.delete('/auth/user/monitor/stations', { params: { station } })
    return response.data
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
