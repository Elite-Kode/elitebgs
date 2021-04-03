const state = {
  theme: '',
  themes: [
    'light',
    'dark'
  ]
}
const mutations = {
  setTheme (state, theme) {
    state.theme = theme
  }
}
const actions = {}

export default {
  state,
  mutations,
  actions
}
