<template>
  <swagger-ui :docs-link="docsLink" :docs-spec="specs" v-model="selectedSpec"></swagger-ui>
</template>

<script>
import SwaggerUi from '@/components/swagger/SwaggerUi'
import _isEmpty from 'lodash/isEmpty'

export default {
  name: 'EddbApiDocs',
  components: {
    'swagger-ui': SwaggerUi
  },
  props: {
    version: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      specs: [
        {
          versionName: 'V1',
          specLocation: 'https://eddbapi.kodeblox.com/api/v1/api-docs.json',
          swaggerLocation: 'https://eddbapi.kodeblox.com/api/v1/docs'
        },
        {
          versionName: 'V2',
          specLocation: 'https://eddbapi.kodeblox.com/api/v2/api-docs.json',
          swaggerLocation: 'https://eddbapi.kodeblox.com/api/v2/docs'
        },
        {
          versionName: 'V3',
          specLocation: 'https://eddbapi.kodeblox.com/api/v3/api-docs.json',
          swaggerLocation: 'https://eddbapi.kodeblox.com/api/v3/docs'
        },
        {
          versionName: 'V4',
          specLocation: 'https://eddbapi.kodeblox.com/api/v4/api-docs.json',
          swaggerLocation: 'https://eddbapi.kodeblox.com/api/v4/docs'
        },
        {
          versionName: 'V5',
          specLocation: 'https://generator.swagger.io/api/swagger.json',
          swaggerLocation: 'https://eddbapi.kodeblox.com/api/v4/docs'
        }
      ],
      selectedSpec: {}
    }
  },
  async created () {
    await this.checkRedirect()
    this.selectedSpec = this.specs.find(spec => spec.versionName === this.version)
  },
  computed: {
    docsLink () {
      return {
        name: 'eddb-api-docs-home',
        params: {
          version: this.version
        }
      }
    }
  },
  methods: {
    async checkRedirect () {
      if (!this.version || !this.specs.find(spec => spec.versionName === this.version)) {
        await this.$router.replace({
          name: 'eddb-api-docs-home',
          params: { version: this.specs[this.specs.length - 1].versionName }
        })
      }
    }
  },
  watch: {
    selectedSpec (newVal, oldVal) {
      if (!_isEmpty(oldVal) && !_isEmpty(newVal) && newVal.versionName !== oldVal.versionName) {
        this.$router.push({
          name: 'eddb-api-docs-home',
          params: { version: this.selectedSpec.versionName }
        })
      }
    },
    $route (to, from) {
      if (to.name === 'eddb-api-docs') {
        this.$router.replace(from)
      }
    }
  }
}
</script>

<style scoped>

</style>
