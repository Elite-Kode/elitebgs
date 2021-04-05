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
<style>
.v-image .v-responsive__content {
  max-width: 100%;
}
</style>
