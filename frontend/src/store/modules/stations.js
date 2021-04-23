import axios from 'axios'
import _isEmpty from 'lodash/isEmpty'

const state = {
  stations: [],
  selectedStation: {}
}
const getters = {
  friendlyStations (state, getters) {
    return state.stations.map(station => {
      return {
        ...station,
        government: getters.government(station.government),
        allegiance: getters.superpower(station.allegiance),
        type: getters.station(station.type),
        economy: getters.economy(station.economy),
        state: getters.state(station.state)
      }
    })
  },
  friendlyStation (state, getters) {
    let station = state.selectedStation
    return _isEmpty(station) ? {} : {
      ...station,
      government: getters.government(station.government),
      allegiance: getters.superpower(station.allegiance),
      type: getters.station(station.type),
      economy: getters.economy(station.economy),
      state: getters.state(station.state)
    }
  }
}
const mutations = {
  setStations (state, stations) {
    state.stations = stations
  },
  setSelectedStation (state, station) {
    state.selectedStation = station
  }
}
const actions = {
  async fetchStations (context, { page, beginsWith }) {
    let response = await axios.get('/api/ebgs/v5/stations', { params: { page, minimal: true, beginsWith } })
    return response.data
  },
  async fetchStationByEddbId (context, { eddbId }) {
    let response = await axios.get('/api/ebgs/v5/stations', { params: { eddbId, minimal: true } })
    return response.data
  },
  async fetchStationWithHistoryById (context, { id, timeMin, timeMax }) {
    let response = await axios.get('/api/ebgs/v5/stations', {
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
