<template>
  <div :class="{'fill-height': isHome && !authenticated}">
    <ed-toolbar>
      <template v-slot:toolbar-tabs>
        <v-tabs
          align-with-title
          background-color="accent"
          light
          slider-color="secondary"
        >
          <v-tab v-for="(tabItem, i) in tabItems" :key="i" :to="{name: tabItem.link}" :exact="tabItem.exact">
            {{ tabItem.name }}
          </v-tab>
        </v-tabs>
      </template>
    </ed-toolbar>
    <v-main :class="{'fill-height': isHome && !authenticated}">
      <v-container fluid :class="{'fill-height': isHome && !authenticated}">
        <home-view v-if="isHome"/>
        <router-view/>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import HomeView from '@/components/main/home/HomeView'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      tabItems: [{
        name: 'Home',
        link: 'home',
        exact: true
      }, {
        name: 'Systems',
        link: 'systems'
      }, {
        name: 'Factions',
        link: 'factions'
      }, {
        name: 'Stations',
        link: 'stations'
      }]
    }
  },
  components: {
    'home-view': HomeView,
    'ed-toolbar': Toolbar
  },
  computed: {
    ...mapState({
      authenticated: state => state.auth.authenticated
    }),
    isHome () {
      return this.$route.name === 'home'
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

a.v-tab--active.v-tab
  color: map-deep-get($material-light, 'text', 'primary')
</style>
