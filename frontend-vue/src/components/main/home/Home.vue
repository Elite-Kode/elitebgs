<template>
  <div>
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
    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'

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
    'ed-toolbar': Toolbar
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

a.v-tab--active.v-tab
  color: map-deep-get($material-light, 'text', 'primary')
</style>
