<template>
    <v-card>
        <v-card-title class="title text-uppercase">
            Login
        </v-card-title>

        <v-card-text>
            Login using your Frontier credentials for a seamless integration
        </v-card-text>

        <v-card-actions>
            <v-btn block class="login-button" color="primary" href="/auth/frontier">
                Login with
                <img :src="require('@/assets/Frontier-invert.svg')" alt="Frontier Logo"/>
            </v-btn>
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
