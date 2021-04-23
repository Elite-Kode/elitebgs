<template>
  <div>
    <swagger-nav v-model="navOpen" :version="version"></swagger-nav>
    <div class="d-flex">
      <v-app-bar-nav-icon @click="toggleNav"/>
      <v-menu offset-y>
        <template v-slot:activator="{ attrs, on }">
          <v-btn v-bind="attrs" v-on="on" outlined color="primary">
            {{ selectedSpec.versionName }}
            <v-icon right dark>
              expand_more
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="doc in specs" :key="doc.versionName" link @click="versionSelected(doc)">
            <v-list-item-title class="text-center">{{ doc.versionName }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer/>
      <v-btn-toggle multiple max=0>
        <v-btn color="primary" :href="selectedSpec.specLocation" target="_blank" rel="noopener noreferrer">
          Spec
        </v-btn>
        <v-btn color="primary" :href="selectedSpec.swaggerLocation" target="_blank" rel="noopener noreferrer">
          Swagger
        </v-btn>
      </v-btn-toggle>
    </div>
    <router-view/>
  </div>
</template>

<script>
import SwaggerNav from '@/components/swagger/SwaggerNav'
import _isEmpty from 'lodash/isEmpty'

export default {
  name: 'SwaggerUi',
  components: {
    'swagger-nav': SwaggerNav
  },
  props: {
    specs: {
      type: Array,
      default () {
        return []
      }
    },
    version: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      navOpen: true,
      selectedSpec: {}
    }
  },
  async created () {
    await this.checkRedirectAndSelect()
    this.selectSpec()
  },
  computed: {
    rootLink () {
      return this.$route.path.split('/')[1]
    }
  },
  methods: {
    async checkRedirectAndSelect () {
      if (!this.version || !this.findSpec(this.version)) {
        // Is triggered when the browser hits the docs endpoint without or with the wrong version
        await this.$router.replace({
          name: `${this.rootLink}-api-docs`,
          params: { version: this.specs[this.specs.length - 1].versionName }
        })
      }
    },
    selectSpec () {
      this.selectedSpec = this.findSpec(this.version)
    },
    toggleNav () {
      this.navOpen = !this.navOpen
    },
    versionSelected (version) {
      this.selectedSpec = this.findSpec(version.versionName)
    },
    findSpec (version) {
      return this.specs.find(spec => spec.versionName === version)
    }
  },
  watch: {
    selectedSpec (newVal, oldVal) {
      if (newVal?.versionName !== oldVal?.versionName) {
        this.$store.dispatch('fetchSpecDoc', { specLocation: this.selectedSpec.specLocation })
      }
      // Handles routing to a new path using the version number of the selected spec
      if (
        !_isEmpty(oldVal) &&
        !_isEmpty(newVal) &&
        newVal.versionName !== oldVal.versionName && // If the selection is made to the same spec
        this.$route.params.version !== newVal.versionName // To prevent double travel to the route on clicking forward or back in browser
      ) {
        this.$router.push({
          name: `${this.rootLink}-api-docs`,
          params: { version: this.selectedSpec.versionName }
        })
      }
    },
    async version (newVal) {
      if (newVal) {
        this.selectedSpec = this.findSpec(newVal)
      }
    },
    $route (to, from) {
      // Handles the case when the docs tab is re-clicked
      if (!to.params.version && from.params.version) {
        this.$router.replace(from)
      }
    }
  }
}
</script>

<style scoped>

</style>
