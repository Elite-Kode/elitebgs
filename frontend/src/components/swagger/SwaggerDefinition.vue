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
          <td
            v-if="getProperty(property).type &&
                  getProperty(property).type !== 'integer'&&
                  getProperty(property).type !== 'array'"
          >
            <a
              :href="`https://developer.mozilla.org/en-US/docs/Glossary/${getProperty(property).type}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ getProperty(property).type }}
            </a>
          </td>
          <td
            v-else-if="getProperty(property).type &&
                       getProperty(property).type === 'integer'"
          >
            <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/number"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ getProperty(property).type }}
            </a>
          </td>
          <!--If the type is an object and it has a reference-->
          <td v-else-if="getProperty(property).$ref">
            <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/object"
              target="_blank"
              rel="noopener noreferrer"
            >Object
            </a>
            &#60;
            <router-link
              :to="getDefinitionPath(getDefinitionFromRef(getProperty(property).$ref))"
            >
              {{ getDefinitionFromRef(getProperty(property).$ref) }}
            </router-link>
            &#62;
          </td>
          <!--If the type is an array of some kind-->
          <td
            v-else-if="getProperty(property).type &&
                       getProperty(property).type === 'array' &&
                       getProperty(property).items.type &&
                       getProperty(property).items.type !== 'integer'"
          >
            <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/array"
              target="_blank"
              rel="noopener noreferrer"
            >
              Array
            </a>
            &#60;
            <a
              :href="`https://developer.mozilla.org/en-US/docs/Glossary/${getProperty(property).items.type}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ getProperty(property).items.type }}
            </a>
            &#62;
          </td>
          <td
            v-else-if="getProperty(property).type &&
                       getProperty(property).type === 'array' &&
                       getProperty(property).items.type &&
                       getProperty(property).items.type === 'integer'"
          >
            <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/array"
              target="_blank"
              rel="noopener noreferrer"
            >
              Array
            </a>
            &#60;
            <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/number"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ getProperty(property).items.type }}
            </a>
            &#62;
          </td>
          <!--If the type is an array of some object with a ref-->
          <td
            v-else-if="getProperty(property).type &&
                       getProperty(property).type === 'array' &&
                       getProperty(property).items.$ref"
          >
            <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/array"
              target="_blank"
              rel="noopener noreferrer"
            >Array
            </a>
            &#60;
            <router-link
              :to="getDefinitionPath(getDefinitionFromRef(getProperty(property).items.$ref))"
            >
              {{ getDefinitionFromRef(getProperty(property).items.$ref) }}
            </router-link>
            &#62;
          </td>
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
    getDefinitionPath (definition) {
      return {
        name: `${this.link}-api-docs-definition`,
        params: {
          definition: definition,
          version: this.$route.params.version
        }
      }
    },
    getDefinitionFromRef (ref) {
      return ref.replace('#/definitions/', '')
    },
    getProperties () {
      return Object.keys(this.currentDefinition[1].properties)
    },
    getProperty (property) {
      return this.currentDefinition[1].properties[property]
    }
  },
  computed: {
    ...mapGetters({
      definitions: 'getDefinitions'
    }),
    link () {
      return this.$route.path.split('/')[1]
    },
    currentDefinition () {
      return this.definitions.find(definition => definition[0] === this.definition)
    }
  }
}
</script>

<style scoped>

</style>
