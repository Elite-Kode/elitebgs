import axios from 'axios'

const state = {
  factions: []
}
const getters = {
  friendlyFactions: (state) => {
    return state.factions.map(faction => {
      return {
        _id: faction._id,
        name: faction.name,
        government: titlify(faction.government),
        allegiance: titlify(faction.allegiance)
      }
    })
  }
}
const mutations = {
  setFactions (state, factions) {
    state.factions = factions
  }
}
const actions = {
  async fetchFactions ({ commit }, { page, minimal, beginsWith }) {
    let response = await axios.get('/api/ebgs/v5/factions', { params: { page, minimal, beginsWith } })
    return response.data
  }
}

function titlify (title) {
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

export default {
  state,
  getters,
  mutations,
  actions
}
