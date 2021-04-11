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
          <v-tab v-for="(tabItem, i) in tabItems" :key="i" :to="tabItem.link" exact>
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
  name: 'DocsLayout',
  props: {
    overviewLink: {
      type: String,
      default: ''
    },
    docsLink: {
      type: String,
      default: 'docs'
    }
  },
  computed: {
    tabItems () {
      return [{
        name: 'Overview',
        link: this.overviewLink
      }, {
        name: 'Docs',
        link: this.docsLink
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
