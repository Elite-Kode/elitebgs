<template>
    <v-card>
        <v-card-title class="title text-uppercase">
            Login
        </v-card-title>

        <v-card-text>
            Login using your Discord credentials for a seamless integration
        </v-card-text>

        <v-card-actions class="flex-wrap">
          <v-btn block class="login-button" color="secondary" href="/auth/discord">
            Login with
            <img :src="require('@/assets/discord-logo-text-logo.svg')" alt="Discord Logo"/>
          </v-btn>
<!--          <v-btn block class="login-button ml-0 mt-2" color="primary" href="/auth/frontier">-->
<!--            Login with-->
<!--            <img :src="require('@/assets/Frontier-invert.svg')" alt="Frontier Logo"/>-->
<!--          </v-btn>-->
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
  name: 'LoginCard'
}
</script>

<style scoped>
.login-button img {
    height: 24px;
    padding-left: 4px;
}
</style>
