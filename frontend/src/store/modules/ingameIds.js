import axios from 'axios'
import { getName } from '@/store/helpers'

const state = {
  allIds: {}
}
const getters = {
  economy: (state) => (economy) => getName(state, 'economy', economy),
  government: (state) => (government) => getName(state, 'government', government),
  happiness: (state) => (happiness) => getName(state, 'happiness', happiness),
  security: (state) => (security) => getName(state, 'security', security),
  state: (state) => (factionState) => getName(state, 'state', factionState),
  station: (state) => (station) => getName(state, 'station', station),
  superpower: (state) => (superpower) => getName(state, 'superpower', superpower)
}
const mutations = {
  setAllIds (state, allIds) {
    state.allIds = allIds
  }
}
const actions = {
  async fetchAllIds ({ commit }) {
    let response = await axios.get('/api/ingameids/all')
    let allIds = response.data
    commit('setAllIds', allIds)
    return allIds
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
