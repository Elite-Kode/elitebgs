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
  },
  getMethods: (state) => (path) => {
    return Object.keys(state.specDoc?.paths[path])
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
  },
  async fetchFromApiUrl (context, { url, method, data }) {
    let response = await axios({
      method,
      url,
      data
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
