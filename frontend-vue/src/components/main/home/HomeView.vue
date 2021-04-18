<template>
  <login-card class="login"/>
</template>

<script>
import LoginCard from '@/components/LoginCard'

export default {
  name: 'HomeView',
  components: {
    'login-card': LoginCard
  }
}
</script>

<style scoped>
.login {
  width: 360px;
  margin: auto
}
</style>
