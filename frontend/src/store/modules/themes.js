const state = {
  theme: '',
  themes: ['light', 'dark'],
  themeMedia: null,
  themeMediaListenerMethod: null
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
  },
  setThemeMedia(state, themeMedia) {
    state.themeMedia = themeMedia
  },
  setThemeMediaListener(state, method) {
    state.themeMediaListenerMethod = method
    state.themeMedia.addEventListener('change', method)
  },
  unsetThemeMediaListener(state) {
    state.themeMedia.removeEventListener('change', state.themeMediaListenerMethod)
    state.themeMediaListenerMethod = null
  }
}
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
