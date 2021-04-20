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
      <section>
        <v-card class="my-3">
          <v-expansion-panels accordion multiple>
            <v-expansion-panel v-for="faction of factions" :key="faction._id">
              <v-expansion-panel-header class="py-0">
                {{ faction.name }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="custom-padding">
                <v-expansion-panels accordion multiple>
                  <v-expansion-panel>
                    <v-expansion-panel-header class="py-0">
                      Current State
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="custom-padding">
                      Table
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header class="py-0">
                      Last 10 Days
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="custom-padding">
                      Influence Chart
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </section>
      <section class="d-flex">
        <h1>Monitoring Systems</h1>
        <v-spacer/>
        <v-btn class="primary">
          <v-icon>add</v-icon>
          Add
        </v-btn>
      </section>
      <section>
        <v-card class="my-3">
          <v-expansion-panels accordion multiple>
            <v-expansion-panel v-for="system of systems" :key="system._id">
              <v-expansion-panel-header class="py-0">
                {{ system.name }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="custom-padding">
                <v-expansion-panels accordion multiple>
                  <v-expansion-panel>
                    <v-expansion-panel-header class="py-0">
                      Current State
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="custom-padding">
                      Table
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header class="py-0">
                      Last 10 Days
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="custom-padding">
                      Influence Chart
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </section>
    </div>
  </div>
</template>

<script>
import LoginCard from '@/components/LoginCard'
import _isEmpty from 'lodash/isEmpty'
import { mapGetters, mapMutations, mapState } from 'vuex'

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
  async created () {
    if (this.authUser && !_isEmpty(this.authUser)) {
      this.fetchFactionWithHistoryById()
      this.fetchSystemWithHistoryById()
    }
  },
  computed: {
    ...mapState({
      authenticated: state => state.auth.authenticated,
      authUser: state => state.auth.user
    }),
    ...mapGetters({
      factions: 'friendlyUserFactions',
      systems: 'friendlyUserSystems'
    })
  },
  watch: {
    authUser () {
      if (this.authUser) {
        this.fetchFactionWithHistoryById()
        this.fetchSystemWithHistoryById()
      }
    }
  },
  methods: {
    ...mapMutations([
      'setUserFactions',
      'setUserSystems'
    ]),
    async fetchFactionWithHistoryById () {
      // this.loading = true
      let factions = this.authUser.factions
      factions.sort((first, second) => first.name_lower > second.name_lower)
      let factionPromises = factions.map(async faction => {
        let factionsPaginated = await this.$store.dispatch('fetchFactionWithHistoryById', {
          id: faction.id,
          timeMin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          timeMax: new Date(Date.now())
        })
        return factionsPaginated.docs[0]
      })
      this.setUserFactions(await Promise.all(factionPromises))
      // this.loading = false
    },
    async fetchSystemWithHistoryById () {
      // this.loading = true
      let systems = this.authUser.systems
      systems.sort((first, second) => first.name_lower > second.name_lower)
      let systemPromises = systems.map(async system => {
        let systemsPaginated = await this.$store.dispatch('fetchSystemWithHistoryById', {
          id: system.id,
          timeMin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          timeMax: new Date(Date.now())
        })
        return systemsPaginated.docs[0]
      })
      this.setUserSystems(await Promise.all(systemPromises))
      // this.loading = false
    }
  }
}
</script>

<style scoped>
.login {
  width: 360px;
  margin: auto
}
</style>
