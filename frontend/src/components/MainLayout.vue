<template>
  <v-app v-scroll="onScroll">
    <v-theme-provider root>
      <router-view/>
    </v-theme-provider>
    <scroller :scroll-position="scrollPosition"/>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Scroller from '@/components/Scroller'

export default {
  name: 'MainLayout',
  components: {
    'scroller': Scroller
  },
  data () {
    return {
      scrollPosition: 0
    }
  },
  computed: {
    ...mapState({
      theme: state => state.themes.theme,
      themes: state => state.themes.themes
    })
  },
  watch: {
    theme () {
      this.$vuetify.theme.dark = this.theme === this.themes[1]
    }
  },
  created () {
    this.$store.dispatch('checkAuthenticated')
    this.$store.dispatch('fetchAuthUser')
    this.$store.dispatch('fetchAllIds')
    this.$vuetify.theme.dark = this.theme === this.themes[1]
  },
  methods: {
    onScroll (e) {
      this.scrollPosition = e.target.scrollingElement.scrollTop
    }
  }
}
</script>
