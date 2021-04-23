<template>
  <div>
    <h1>The complete RESTful API for EDDB</h1>
    <h3>
      Currently <a href="https://eddb.io/">EDDB</a> is the greatest treasure of information of the galaxy and it is a
      user
      friendly tool for many pilots. But it lacks an API for developers. Elite BGS is an attempt to fill this gap by
      providing
      an API for EDDB data sources.
    </h3>
    <h2>API</h2>
    <v-card>
      <v-card-title>Access</v-card-title>
      <v-card-text>
        Consumers must make a GET request at any endpoint.
      </v-card-text>
    </v-card>
    <v-card class="mt-2">
      <v-card-title>Endpoints</v-card-title>
      <v-card-text>
        <div>
          <h3>Factions</h3>
          <code>https://eddbapi.kodeblox.com/api/v4/factions?&lt;params&gt;</code>
          <h3>Populated Systems</h3>
          <code>https://eddbapi.kodeblox.com/api/v4/populatedsystems?&lt;params&gt;</code>
          <h3>Stations</h3>
          <code>https://eddbapi.kodeblox.com/api/v4/stations?&lt;params&gt;</code>
          <h3>Systems</h3>
          <code>https://eddbapi.kodeblox.com/api/v4/systems?&lt;params&gt;</code>
        </div>
        <div>
          *Please note that the endpoints have been changed to their own subdomain.
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'EddbApiOverview'
}
</script>

<style scoped>

</style>
