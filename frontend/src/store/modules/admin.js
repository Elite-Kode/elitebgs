import axios from 'axios'

const state = {
  users: [],
  selectedUser: {}
}
const getters = {}
const mutations = {
  setUsers (state, users) {
    state.users = users
  },
  setSelectedUser (state, user) {
    state.selectedUser = user
  }
}
const actions = {
  async fetchUsers (context, { page, beginsWith }) {
    let response = await axios.get('/frontend/users', { params: { page, beginsWith } })
    return response.data
  },
  async fetchUserById (context, { id }) {
    let response = await axios.get('/frontend/users', { params: { id } })
    return response.data
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
