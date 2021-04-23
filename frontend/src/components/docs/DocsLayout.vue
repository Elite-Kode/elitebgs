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
          <v-tab :to="{name: rootLink + '-api-overview'}" exact>Overview</v-tab>
          <v-tab :to="{name: rootLink + '-api-docs'}">Docs</v-tab>
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
  components: {
    'ed-toolbar': Toolbar
  },
  computed: {
    rootLink () {
      return this.$route.path.split('/')[1]
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

a.v-tab--active.v-tab
  color: map-deep-get($material-light, 'text', 'primary')
</style>
