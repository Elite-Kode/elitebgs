<template>
  <!--Check for undefined to prevent flash of wrong element-->
  <login-card v-if="!authenticated && authenticated!==undefined" class="login"/>
  <div v-else-if="authenticated && authenticated!==undefined">
    <div v-if="authUser.access===bannedAccess">
      <h1>You have been Banned from the website.</h1>
      <p>Please contact the developer for further details</p>
    </div>
    <div v-else>
      <section class="d-flex">
        <h1>Monitoring Factions</h1>
        <v-spacer/>
        <v-btn class="primary">
          <v-icon>add</v-icon>
          Add
        </v-btn>
      </section>
    </div>
  </div>
</template>

<script>
import LoginCard from '@/components/LoginCard'
import { mapState } from 'vuex'

export default {
  name: 'HomeView',
  components: {
    'login-card': LoginCard
  },
  data () {
    return {
      bannedAccess: 'BANNED',
      normalAccess: 'NORMAL',
      adminAccess: 'ADMIN'
    }
  },
  computed: {
    ...mapState({
      authenticated: state => state.auth.authenticated,
      authUser: state => state.auth.user
    })
  }
}
</script>

<style scoped>
.login {
  width: 360px;
  margin: auto
}
</style>
