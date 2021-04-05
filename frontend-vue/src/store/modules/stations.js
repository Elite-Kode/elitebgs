import axios from 'axios'

const state = {
  stations: []
}
const getters = {
  friendlyStations: (state, getters) => {
    return state.stations.map(station => {
      return {
        _id: station._id,
        name: station.name,
        system: station.system,
        system_id: station.system_id,
        government: getters.government(station.government),
        allegiance: getters.superpower(station.allegiance),
        type: getters.station(station.type),
        economy: getters.economy(station.economy),
        state: getters.state(station.state)
      }
    })
  }
}
const mutations = {
  setStations (state, stations) {
    state.stations = stations
  }
}
const actions = {
  async fetchStations (context, { page, beginsWith }) {
    let response = await axios.get('/api/ebgs/v5/stations', { params: { page, minimal: true, beginsWith } })
    return response.data
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
