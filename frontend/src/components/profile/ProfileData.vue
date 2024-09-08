<template>
  <div>
    <h1>Profile Data</h1>
    <v-form>
      <!--      <v-row align="center">-->
      <!--        <v-col cols="3">-->
      <!--          <v-subheader>Commander Name</v-subheader>-->
      <!--        </v-col>-->
      <!--        <v-col cols="9">-->
      <!--          <v-text-field-->
      <!--            :value="authUser.commander"-->
      <!--            dense-->
      <!--            readonly>-->
      <!--          </v-text-field>-->
      <!--        </v-col>-->
      <!--      </v-row>-->
      <v-row align="center">
        <v-col cols="3">
          <v-subheader>Discord Name</v-subheader>
        </v-col>
        <v-col cols="9">
          <v-text-field :value="`${authUser.username}#${authUser.discriminator}`" dense readonly> </v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-subheader>ID</v-subheader>
        </v-col>
        <v-col cols="3">
          <v-text-field :value="authUser._id" dense readonly />
        </v-col>
        <v-col cols="3">
          <!--          <v-subheader>Frontier ID</v-subheader>-->
          <v-subheader>Discord ID</v-subheader>
        </v-col>
        <v-col cols="3">
          <v-text-field :value="authUser.id" dense readonly />
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-subheader>Access</v-subheader>
        </v-col>
        <v-col cols="3">
          <v-text-field :value="authUser.access" dense readonly />
        </v-col>
        <!--        <v-col cols="3">-->
        <!--          <v-subheader>Trusted</v-subheader>-->
        <!--        </v-col>-->
        <!--        <v-col cols="3">-->
        <!--          <v-checkbox-->
        <!--            v-model="authUser.trusted"-->
        <!--            dense-->
        <!--            readonly/>-->
        <!--        </v-col>-->
      </v-row>
    </v-form>
    <h2>Themes</h2>
    <v-row class="mt-6">
      <v-col cols="12" xs="12" sm="4">
        <div class="d-flex flex-column align-center">
          <v-img
            :src="require('@/assets/elitebgs-dark-light.png')"
            alt="Elite BGS System Theme"
            contain
            max-height="256px"
            class="mb-3"
          />
          <v-btn outlined color="primary" @click="selectTheme(0)">System Theme</v-btn>
        </div>
      </v-col>
      <v-col cols="12" xs="12" sm="4">
        <div class="d-flex flex-column align-center">
          <v-img
            :src="require('@/assets/elitebgs-light.png')"
            alt="Elite BGS Light Theme"
            contain
            max-height="256px"
            class="mb-3"
          />
          <v-btn color="primary" @click="selectTheme(1)">Light Theme</v-btn>
        </div>
      </v-col>
      <v-col cols="12" xs="12" sm="4">
        <div class="d-flex flex-column align-center">
          <v-img
            :src="require('@/assets/elitebgs-dark.png')"
            alt="Elite BGS Dark Theme"
            contain
            max-height="256px"
            class="mb-3"
          />
          <v-btn color="primary" @click="selectTheme(2)">Dark Theme</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="6">
        <monitored-entities entity-name="Factions" :entities="authUser.factions" @delete="deleteFaction" />
      </v-col>
      <v-col cols="12" xs="12" sm="6">
        <monitored-entities entity-name="Systems" :entities="authUser.systems" @delete="deleteSystem" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MonitoredEntities from '@/components/profile/MonitoredEntities'

export default {
  name: 'ProfileData',
  components: {
    'monitored-entities': MonitoredEntities
  },
  computed: {
    ...mapState({
      authUser: (state) => state.auth.user
    })
  },
  created() {
    this.$store.dispatch('checkAuthenticated')
    this.$store.dispatch('fetchAuthUser')
  },
  methods: {
    deleteFaction(id) {
      this.$store.dispatch('deleteUserFaction', id)
    },
    deleteSystem(id) {
      this.$store.dispatch('deleteUserSystem', id)
    },
    selectTheme(themeIndex) {
      if (themeIndex === 0) {

      }
      console.log(themeIndex)
    }
  }
}
</script>

<style scoped></style>
