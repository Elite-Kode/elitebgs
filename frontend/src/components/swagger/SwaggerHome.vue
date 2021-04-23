<template>
  <div>
    <template v-if="selectedSpecDoc">
      <h1>{{ selectedSpecDoc.info.title }}</h1>
      <h2>{{ selectedSpecDoc.info.description }}</h2>
      <h3>Version {{ selectedSpecDoc.info.version }}</h3>
      <v-row class="mt-4">
        <template v-for="path in paths">
          <v-col cols="12" xs="12" sm="6" md="4" lg="3" v-for="method in getMethods(path[0])" :key="path[0]+method">
            <v-card>
              <v-card-title>
                Endpoint {{ path[0] }}
              </v-card-title>
              <v-card-subtitle>
                Method {{ method.toUpperCase() }}
                <v-chip color="error" dark v-if="path[1][method].deprecated"> Deprecated</v-chip>
              </v-card-subtitle>
              <v-card-text> {{ path[1][method].description }}</v-card-text>
              <v-card-actions>
                <v-btn text color="primary" @click="tryApi(path[0], method)">
                  Try API
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
      </v-row>
      <swagger-try-api v-model="tryApiOpen" :path="tryApiPath" :method="tryApiMethod"></swagger-try-api>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SwaggerTryApi from '@/components/swagger/SwaggerTryApi'

export default {
  name: 'SwaggerHome',
  components: {
    'swagger-try-api': SwaggerTryApi
  },
  data () {
    return {
      tryApiOpen: false,
      tryApiPath: '',
      tryApiMethod: ''
    }
  },
  computed: {
    ...mapState({
      selectedSpecDoc: state => state.tryApi.specDoc
    }),
    ...mapGetters({
      paths: 'getPaths',
      definitions: 'getDefinitions',
      getMethods: 'getMethods'
    })
  },
  methods: {
    tryApi (path, method) {
      this.tryApiPath = path
      this.tryApiMethod = method
      this.tryApiOpen = true
    }
  }
}
</script>

<style scoped>

</style>
