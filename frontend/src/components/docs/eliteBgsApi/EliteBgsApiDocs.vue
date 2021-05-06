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
  data() {
    return {
      specs: [
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

<style scoped></style>
