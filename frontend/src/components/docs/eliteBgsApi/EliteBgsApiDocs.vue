<template>
  <swagger-ui :specs="specs" :version="version"></swagger-ui>
</template>

<script>
import SwaggerUi from '@/components/swagger/SwaggerUi'

export default {
  name: 'EliteBgsApiDocs',
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
        //   specLocation: '/api/ebgs/v1/api-docs.json',
        //   swaggerLocation: '/api/ebgs/v1/docs'
        // },
        // {
        //   versionName: 'V2',
        //   specLocation: '/api/ebgs/v2/api-docs.json',
        //   swaggerLocation: '/api/ebgs/v2/docs'
        // },
        // {
        //   versionName: 'V3',
        //   specLocation: '/api/ebgs/v3/api-docs.json',
        //   swaggerLocation: '/api/ebgs/v3/docs'
        // },
        // {
        //   versionName: 'V4',
        //   specLocation: '/api/ebgs/v4/api-docs.json',
        //   swaggerLocation: '/api/ebgs/v4/docs'
        // },
        {
          versionName: 'V5',
          specLocation: '/api/ebgs/v5/api-docs.json',
          swaggerLocation: '/api/ebgs/v5/docs'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
