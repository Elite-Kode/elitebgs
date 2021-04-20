import { formattedFaction, formattedSystem } from '@/store/helpers'

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
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
