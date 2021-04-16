<template>
  <div>
    <swagger-nav :docs-link="docsLink" :link="link" v-model="navOpen"></swagger-nav>
    <div class="d-flex">
      <v-app-bar-nav-icon @click="toggleNav"/>
      <v-menu offset-y>
        <template v-slot:activator="{ attrs, on }">
          <v-btn v-bind="attrs" v-on="on" outlined color="primary">
            {{ value.versionName }}
            <v-icon right dark>
              expand_more
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="doc in docsSpec" :key="doc.versionName" link @click="versionSelected(doc)">
            <v-list-item-title class="text-center">{{ doc.versionName }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer/>
      <v-btn-toggle multiple max=0>
        <v-btn color="primary" :href="value.specLocation">
          Spec
        </v-btn>
        <v-btn color="primary" :href="value.swaggerLocation">
          Swagger
        </v-btn>
      </v-btn-toggle>
    </div>
    <router-view/>
  </div>
</template>

<script>
import SwaggerNav from '@/components/swagger/SwaggerNav'
import { mapGetters } from 'vuex'

export default {
  name: 'SwaggerUi',
  components: {
    'swagger-nav': SwaggerNav
  },
  props: {
    docsLink: {
      type: Object,
      default () {
        return null
      }
    },
    link: {
      type: String,
      default: ''
    },
    docsSpec: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      navOpen: true,
      selectedSpecDoc: null
    }
  },
  computed: {
    ...mapGetters({
      paths: 'getPaths',
      definitions: 'getDefinitions'
    })
  },
  methods: {
    toggleNav () {
      this.navOpen = !this.navOpen
    },
    versionSelected (version) {
      this.$emit('input', this.docsSpec.find(doc => doc.versionName === version.versionName))
    }
  },
  watch: {
    async value (newVal, oldVal) {
      if (newVal.versionName !== oldVal.versionName) {
        this.selectedSpecDoc = await this.$store.dispatch('fetchSpecDoc', { specLocation: this.value.specLocation })
      }
    }
  }
}
</script>

<style scoped>

</style>
