<template>
  <div>
    <h1>Overview</h1>
    <v-card class="mt-2">
      <v-card-title>
        User Overview
      </v-card-title>
      <v-card-text>
        Total Number of Users: {{ userCount }}
        <br>
        Latest User: {{ latestUser }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AdminData',
  data () {
    return {
      userCount: 0,
      latestUser: ''
    }
  }
}
</script>

<style scoped>

</style>
