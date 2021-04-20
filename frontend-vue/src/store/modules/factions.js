import axios from 'axios'
import { formattedFaction, titlify } from '@/store/helpers'

const state = {
  factions: [],
  selectedFaction: {}
}
const getters = {
  friendlyFactions (state) {
    return state.factions.map(faction => {
      return {
        ...faction,
        government: titlify(faction.government),
        allegiance: titlify(faction.allegiance)
      }
    })
  },
  friendlyFaction (state, getters) {
    return formattedFaction(state.selectedFaction, getters)
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

export default {
  state,
  getters,
  mutations,
  actions
}
