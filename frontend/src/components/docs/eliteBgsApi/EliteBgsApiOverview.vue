<template>
  <div>
    <h1>A Historical API</h1>
    <h3>
      For ultimate immersion and BGS control, we require not only the latest data but also historical ones. ELITE BGS
      API is a
      step in that direction. It stores information which changes regularly in a historical format. Thus, one can always
      look up the events that led to the current Civil War for instance.
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
          <code>https://elitebgs.app/api/ebgs/v5/factions?&lt;params&gt;</code>
          <h3>Systems</h3>
          <code>https://elitebgs.app/api/ebgs/v5/systems?&lt;params&gt;</code>
          <h3>Stations</h3>
          <code>https://elitebgs.app/api/ebgs/v5/stations?&lt;params&gt;</code>
          <h3>Ticks</h3>
          <code>https://elitebgs.app/api/ebgs/v5/ticks?&lt;params&gt;</code>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'EliteBgsApiOverview'
}
</script>

<style scoped>

</style>
