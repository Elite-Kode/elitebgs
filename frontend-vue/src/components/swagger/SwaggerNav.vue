<template>
  <v-navigation-drawer app clipped v-model="value">
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
    docsLink: {
      type: Object,
      default () {
        return null
      }
    },
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      paths: 'getPaths',
      definitions: 'getDefinitions',
      getMethods: 'getMethods'
    }),
    link () {
      return this.$route.path.split('/')[1]
    }
  },
  methods: {
    getPathLink (path) {
      return {
        name: `${this.link}-api-docs-path`,
        params: {
          path: path.substring(1)
        }
      }
    },
    definitionLink (definition) {
      return `${this.docsLink}/definitions#${definition}`
    }
  },
  watch: {
    async value () {
      this.$emit('input', this.value)
    }
  }
}
</script>

<style scoped>

</style>
