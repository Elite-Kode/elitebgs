import axios from 'axios'
import { formatTime } from '@/store/helpers'

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

export default {
  state,
  mutations,
  actions
}
