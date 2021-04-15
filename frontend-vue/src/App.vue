<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState({
      themes: state => state.themes.themes
    }),
    theme: {
      get () {
        return this.$store.state.themes.theme
      },
      set (newTheme) {
        this.$store.commit('setTheme', newTheme)
      }
    }
  },
  beforeMount () {
    try {
      const stored = localStorage.getItem('theme')
      if (stored) {
        this.theme = stored
      } else {
        this.theme = this.themes[0]
      }
      localStorage.setItem('theme', this.theme)
    } catch (err) {
      this.theme = this.themes[0]
      localStorage.setItem('theme', this.theme)
    }
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

.custom-padding .v-expansion-panel-content__wrap
  padding: 0

.theme--dark.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default
  border-color: map-deep-get($material-dark, 'background') !important

.theme--light.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default
  border-color: map-deep-get($material-light, 'background') !important
</style>
