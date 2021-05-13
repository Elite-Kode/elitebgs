const state = {
  theme: '',
  themes: ['light', 'dark']
}
const getters = {
  themeClass(state) {
    if (state.theme === state.themes[0]) {
      return 'theme--light'
    } else {
      return 'theme--dark'
    }
  }
}
const mutations = {
  setTheme(state, theme) {
    state.theme = theme
  }
}
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
