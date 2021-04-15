import axios from 'axios'

const state = {
  specDoc: null
}
const getters = {
  getPaths (state) {
    return state.specDoc ? Object.entries(state.specDoc.paths) : []
  },
  getDefinitions (state) {
    return state.specDoc ? Object.entries(state.specDoc.definitions) : []
  }
}
const mutations = {
  setSpecDoc (state, specDoc) {
    state.specDoc = specDoc
  }
}
const actions = {
  async fetchSpecDoc ({ commit }, { specLocation }) {
    let response = await axios.get(specLocation)
    let specDoc = response.data
    commit('setSpecDoc', specDoc)
    return specDoc
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
