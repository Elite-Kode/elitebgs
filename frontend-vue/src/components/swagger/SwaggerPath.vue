<template>
  <div v-if="currentPath && method">
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
    <div class="mt-2">
      <section>
        <h3>{{ currentPath[1][method].description }}</h3>
        Parameters
        <v-simple-table dense class="elevation-1">
          <thead>
          <tr>
            <th>Parameter Name</th>
            <th>Parameter Description</th>
            <th>Parameter Type</th>
            <th>Data Type</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="parameter in currentPath[1][method].parameters" :key="parameter.name">
            <td>{{ parameter.name }}</td>
            <td>{{ parameter.description }}</td>
            <td>{{ parameter.in }}</td>
            <td v-if="parameter.type && parameter.type !== 'integer' && parameter.type !== 'array'">
              <a
                :href="`https://developer.mozilla.org/en-US/docs/Glossary/${parameter.type}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ parameter.type }}
              </a>
            </td>
            <td v-else-if="parameter.type && parameter.type === 'integer'">
              <a
                href="https://developer.mozilla.org/en-US/docs/Glossary/number"
                target="_blank"
                rel="noopener noreferrer"
              >{{ parameter.type }}</a>
            </td>
            <!--If the type is an object and it has a reference-->
            <td v-else-if="parameter.$ref">
              <a
                href="https://developer.mozilla.org/en-US/docs/Glossary/object"
                target="_blank"
                rel="noopener noreferrer"
              >Object
              </a>
              &#60;
              <router-link
                :to="getDefinitionPath(getDefinitionFromRef(parameter.$ref))"
              >
                {{ getDefinitionFromRef(parameter.$ref) }}
              </router-link>
              &#62;
            </td>
            <!--If the type is an array of some kind-->
            <td
              v-else-if="parameter.type &&
                         parameter.type === 'array' &&
                         parameter.items.type &&
                         parameter.items.type !== 'integer'"
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
                :href="`https://developer.mozilla.org/en-US/docs/Glossary/${parameter.items.type}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ parameter.items.type }}
              </a>
              &#62;
            </td>
            <td
              v-else-if="parameter.type &&
                         parameter.type === 'array' &&
                         parameter.items.type &&
                         parameter.items.type === 'integer'"
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
                {{ parameter.items.type }}
              </a>
              &#62;
            </td>
            <!--If the type is an array of some object with a ref-->
            <td v-else-if="parameter.type && parameter.type === 'array' && parameter.items.$ref">
              <a
                href="https://developer.mozilla.org/en-US/docs/Glossary/array"
                target="_blank"
                rel="noopener noreferrer"
              >Array
              </a>
              &#60;
              <router-link
                :to="getDefinitionPath(getDefinitionFromRef(parameter.items.$ref))"
              >
                {{ getDefinitionFromRef(parameter.items.$ref) }}
              </router-link>
              &#62;
            </td>
          </tr>
          </tbody>
        </v-simple-table>
      </section>
      <section>
        <h4 class="mb-3">Response Content Types</h4>
        <div v-for="responseType in currentPath[1][method].produces" :key="responseType">
          {{ responseType }}
        </div>
      </section>
      <section class="mt-3">
        <h4>Responses</h4>
        <v-simple-table dense class="elevation-1">
          <tbody>
          <tr v-for="responseCode in getResponses(method)" :key="responseCode">
            <th>{{ responseCode }}</th>
            <td>{{ getResponse(responseCode).description }}</td>
            <td
              v-if="getResponse(responseCode).schema.type &&
                    getResponse(responseCode).schema.type !== 'integer'&&
                    getResponse(responseCode).schema.type !== 'array'"
            >
              <a
                :href="`https://developer.mozilla.org/en-US/docs/Glossary/${getResponse(responseCode).schema.type}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ getResponse(responseCode).schema.type }}
              </a>
            </td>
            <td
              v-else-if="getResponse(responseCode).schema.type &&
                         getResponse(responseCode).schema.type === 'integer'"
            >
              <a
                href="https://developer.mozilla.org/en-US/docs/Glossary/number"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ getResponse(responseCode).schema.type }}
              </a>
            </td>
            <!--If the type is an object and it has a reference-->
            <td v-else-if="getResponse(responseCode).schema.$ref">
              <a
                href="https://developer.mozilla.org/en-US/docs/Glossary/object"
                target="_blank"
                rel="noopener noreferrer"
              >Object
              </a>
              &#60;
              <router-link
                :to="getDefinitionPath(getDefinitionFromRef(getResponse(responseCode).schema.$ref))"
              >
                {{ getDefinitionFromRef(getResponse(responseCode).schema.$ref) }}
              </router-link>
              &#62;
            </td>
            <!--If the type is an array of some kind-->
            <td
              v-else-if="getResponse(responseCode).schema.type &&
                         getResponse(responseCode).schema.type === 'array' &&
                         getResponse(responseCode).schema.items.type &&
                         getResponse(responseCode).schema.items.type !== 'integer'"
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
                :href="`https://developer.mozilla.org/en-US/docs/Glossary/${getResponse(responseCode).schema.items.type}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ getResponse(responseCode).schema.items.type }}
              </a>
              &#62;
            </td>
            <td
              v-else-if="getResponse(responseCode).schema.type &&
                         getResponse(responseCode).schema.type === 'array' &&
                         getResponse(responseCode).schema.items.type &&
                         getResponse(responseCode).schema.items.type === 'integer'"
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
                {{ getResponse(responseCode).schema.items.type }}
              </a>
              &#62;
            </td>
            <!--If the type is an array of some object with a ref-->
            <td
              v-else-if="getResponse(responseCode).schema.type &&
                         getResponse(responseCode).schema.type === 'array' &&
                         getResponse(responseCode).schema.items.$ref"
            >
              <a
                href="https://developer.mozilla.org/en-US/docs/Glossary/array"
                target="_blank"
                rel="noopener noreferrer"
              >Array
              </a>
              &#60;
              <router-link
                :to="getDefinitionPath(getDefinitionFromRef(getResponse(responseCode).schema.items.$ref))"
              >
                {{ getDefinitionFromRef(getResponse(responseCode).schema.items.$ref) }}
              </router-link>
              &#62;
            </td>
          </tr>
          </tbody>
        </v-simple-table>
      </section>
    </div>
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
    },
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
    getResponses (method) {
      return Object.keys(this.currentPath[1][method].responses)
    },
    getResponse (responseCode) {
      return this.currentPath[1][this.method].responses[responseCode]
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
