import axios from 'axios'

const state = {
  authenticated: undefined,
  user: {}
}
const mutations = {
  setAuthenticated (state, authenticated) {
    state.authenticated = authenticated
  },
  setUser (state, user) {
    state.user = user
  }
}
const actions = {
  async checkAuthenticated ({ commit }) {
    let response = await axios.get('/auth/check')
    let isAuthenticated = response.data
    commit('setAuthenticated', isAuthenticated)
    return isAuthenticated
  },
  async fetchAuthUser ({ commit }) {
    let response = await axios.get('/auth/user')
    let userData = response.data
    commit('setUser', userData)
    return userData
  }
}

export default {
  state,
  mutations,
  actions
}
