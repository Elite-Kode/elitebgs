<template>
  <v-navigation-drawer app clipped v-model="navState">
    <v-list expand>
      <v-list-item :to="docsLink" exact>
        Home
      </v-list-item>
      <v-list-group :value="true">
        <template v-slot:activator>
          <v-list-item-title>Paths</v-list-item-title>
        </template>
        <v-list-item v-for="path in paths" :key="path[0]" :to="getPathLink(path[0])">
          <v-list-item-content>
            <v-list-item-title>{{ path[0] }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-group :value="true">
        <template v-slot:activator>
          <v-list-item-title>Definitions</v-list-item-title>
        </template>
        <v-list-item v-for="definition in definitions" :key="definition[0]" :to="definitionLink(definition[0])">
          <v-list-item-content>
            <v-list-item-title>{{ definition[0] }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SwaggerNav',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    version: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      navState: this.value
    }
  },
  computed: {
    ...mapGetters({
      paths: 'getPaths',
      definitions: 'getDefinitions',
      getMethods: 'getMethods'
    }),
    rootLink () {
      return this.$route.path.split('/')[1]
    },
    docsLink () {
      return {
        name: `${this.rootLink}-api-docs`,
        params: {
          version: this.version
        }
      }
    }
  },
  methods: {
    getPathLink (path) {
      return {
        name: `${this.rootLink}-api-docs-path`,
        params: {
          path: path.substring(1),
          version: this.version
        }
      }
    },
    definitionLink (definition) {
      return {
        name: `${this.rootLink}-api-docs-definition`,
        params: {
          definition,
          version: this.version
        }
      }
    }
  },
  watch: {
    navState () {
      this.$emit('input', this.navState)
    },
    value () {
      this.navState = this.value
    }
  }
}
</script>

<style scoped>

</style>
