<template>
  <div v-if="currentDefinition">
    <h1>Definition of {{ currentDefinition[0] }}</h1>
    <div class="mt-2">
      <v-simple-table dense class="elevation-1">
        <thead>
        <tr>
          <th>Property Name</th>
          <th>Property Type</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="property in getProperties()" :key="property">
          <td>{{ property }}</td>
          <td></td>
        </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SwaggerDefinition',
  props: {
    definition: {
      type: String,
      default: ''
    }
  },
  methods: {
    getDefinitionFromRef (ref) {
      return ref.replace('#/definitions/', '')
    },
    getProperties () {
      return Object.keys(this.currentDefinition[1].properties)
    }
  },
  computed: {
    ...mapGetters({
      definitions: 'getDefinitions'
    }),
    currentDefinition () {
      return this.definitions.find(definition => definition[0] === this.definition)
    }
  }
}
</script>

<style scoped>

</style>
