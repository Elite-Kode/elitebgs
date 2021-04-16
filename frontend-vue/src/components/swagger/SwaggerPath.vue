<template>
  <div v-if="currentPath">
    <h1>Endpoint {{ currentPath[0] }}</h1>
    <h3>General Information</h3>
    <v-tabs class="tab-background">
      <v-tab
        v-for="currentMethod in getMethods(currentPath[0])"
        :key="currentMethod"
        :to="{name: `${link}-api-docs-path`, params: {path, method:currentMethod, version: $route.params.version}}"
      >
        {{ currentMethod }}
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _isEmpty from 'lodash/isEmpty'

export default {
  name: 'SwaggerPath',
  props: {
    path: {
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
            name: `${this.link}-api-docs-path`,
            params: {
              path: this.path,
              version: this.$route.params.version,
              method: this.getMethods(this.currentPath[0])[0]
            }
          })
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      paths: 'getPaths',
      getMethods: 'getMethods'
    }),
    link () {
      return this.$route.path.split('/')[1]
    },
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
      if (!to.params.method && from.params.method) {
        this.$router.replace(from)
      }
    }
  }
}
</script>

<style scoped>

</style>
