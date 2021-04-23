<template>
  <swagger-ui :specs="specs" :version="version"></swagger-ui>
</template>

<script>
import SwaggerUi from '@/components/swagger/SwaggerUi'

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
        // {
        //   versionName: 'V1',
        //   specLocation: 'https://eddbapi.kodeblox.com/api/v1/api-docs.json',
        //   swaggerLocation: 'https://eddbapi.kodeblox.com/api/v1/docs'
        // },
        // {
        //   versionName: 'V2',
        //   specLocation: 'https://eddbapi.kodeblox.com/api/v2/api-docs.json',
        //   swaggerLocation: 'https://eddbapi.kodeblox.com/api/v2/docs'
        // },
        // {
        //   versionName: 'V3',
        //   specLocation: 'https://eddbapi.kodeblox.com/api/v3/api-docs.json',
        //   swaggerLocation: 'https://eddbapi.kodeblox.com/api/v3/docs'
        // },
        {
          versionName: 'V4',
          specLocation: 'https://eddbapi.kodeblox.com/api/v4/api-docs.json',
          swaggerLocation: 'https://eddbapi.kodeblox.com/api/v4/docs'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
