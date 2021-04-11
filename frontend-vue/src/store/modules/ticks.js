import axios from 'axios'
import moment from 'moment'

const state = {
  ticks: [],
  currentTick: {}
}
const mutations = {
  setTicks (state, ticks) {
    state.ticks = ticks
  },
  setCurrentTick (state, currentTick) {
    state.currentTick = currentTick
  }
}
const actions = {
  async fetchCurrentTick ({ commit }) {
    let response = await axios.get('/api/ebgs/v5/ticks')
    commit('setCurrentTick', formatTime(response.data[0]))
    return response.data
  },
  async fetchTicks ({ commit }, { timeMin, timeMax }) {
    let response = await axios.get('/api/ebgs/v5/ticks', { params: { timeMin, timeMax } })
    commit('setTicks', response.data.map(formatTime))
    return response.data
  }
}

function formatTime (time) {
  return {
    ...time,
    time_formatted: moment(time.time).utc().format('HH:mm'),
    time_local: moment(time.time).format('HH:mm'),
    updated_at_formatted: moment(time.updated_at).utc().format('ddd, MMM D, HH:mm:ss')
  }
}

export default {
  state,
  mutations,
  actions
}
