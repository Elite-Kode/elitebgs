<template>
  <div v-if="currentPath">
    <h1>Endpoint {{ currentPath[0] }}</h1>
    <h3>General Information</h3>
    <v-tabs class="tab-background">
      <v-tab
        v-for="currentMethod in getMethods(currentPath[0])"
        :key="currentMethod"
        :to="{name: $route.name, params: {path, method:currentMethod}}"
      >
        {{ currentMethod }}
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import _isEmpty from 'lodash/isEmpty'

export default {
  name: 'SwaggerPath',
  props: {
    path: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: ''
    }
  },
  async created () {
    this.checkRedirect()
  },
  methods: {
    checkRedirect () {
      if (this.currentPath && !_isEmpty(this.currentPath)) {
        if (!this.method || !this.getMethods(this.currentPath[0]).find(method => method === this.method)) {
          this.$router.replace({
            name: 'eddb-api-docs-path-method',
            params: {
              path: this.path,
              link: this.link,
              method: this.getMethods(this.currentPath[0])[0]
            }
          })
        }
      }
    }
  },
  computed: {
    ...mapState({
      selectedSpecDoc: state => state.tryApi.specDoc
    }),
    ...mapGetters({
      paths: 'getPaths',
      definitions: 'getDefinitions',
      getMethods: 'getMethods'
    }),
    currentPath () {
      return this.paths.find(path => path[0] === '/' + this.path)
    }
  },
  watch: {
    currentPath (newVal, oldVal) {
      if ((_isEmpty(oldVal) && !_isEmpty(newVal)) || (!_isEmpty(oldVal) && !_isEmpty(newVal) && newVal[0] !== oldVal[0])) {
        this.checkRedirect()
      }
    },
    $route (to, from) {
      if (to.name === 'eddb-api-docs-path') {
        this.$router.replace(from)
      }
    }
  }
}
</script>

<style scoped>

</style>
