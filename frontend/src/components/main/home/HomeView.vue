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
        <entity-add search-type="FACTION"/>
      </section>
      <section>
        <v-card class="my-3">
          <v-expansion-panels accordion multiple v-model="factionsPanel">
            <v-expansion-panel v-for="(faction, index) of factions" :key="faction._id">
              <v-expansion-panel-header class="py-0">
                {{ faction.name }}
                <v-spacer/>
                <v-btn
                  outlined color="primary"
                  :to="{ name: 'faction-detail', params: { factionId: faction._id }}"
                  class="flex-grow-0 mr-3"
                >
                  Go to Faction
                </v-btn>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="custom-padding">
                <v-expansion-panels accordion multiple v-model="factionsDataPanel[index]">
                  <v-expansion-panel>
                    <v-expansion-panel-header class="py-0">
                      Current State
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="custom-padding">
                      <faction-table :system-details="systemDetails(faction)"/>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header class="py-0">
                      Last 10 Days
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="custom-padding">
                      <faction-influence-chart :faction-data="faction"/>
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
        <entity-add search-type="SYSTEM"/>
      </section>
      <section>
        <v-card class="my-3">
          <v-expansion-panels accordion multiple v-model="systemsPanel">
            <v-expansion-panel v-for="(system, index) of systems" :key="system._id">
              <v-expansion-panel-header class="py-0">
                {{ system.name }}
                <v-spacer/>
                <v-btn
                  outlined color="primary"
                  :to="{ name: 'system-detail', params: { systemId: system._id }}"
                  class="flex-grow-0 mr-3"
                >
                  Go to System
                </v-btn>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="custom-padding">
                <v-expansion-panels accordion multiple v-model="systemsDataPanel[index]">
                  <v-expansion-panel>
                    <v-expansion-panel-header class="py-0">
                      Current State
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="custom-padding">
                      <system-table :faction-details="factionDetails(system)"/>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header class="py-0">
                      Last 10 Days
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="custom-padding">
                      <system-influence-chart :system-data="system"/>
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
import FactionTable from '@/components/main/factions/FactionTable'
import componentMethods from '@/mixins/componentMethods'
import SystemTable from '@/components/main/systems/SystemTable'
import FactionInfluenceChart from '@/components/charts/FactionInfluenceChart'
import SystemInfluenceChart from '@/components/charts/SystemInfluenceChart'
import EntityAdd from '@/components/main/home/EntityAdd'

export default {
  name: 'HomeView',
  components: {
    'entity-add': EntityAdd,
    'faction-influence-chart': FactionInfluenceChart,
    'system-influence-chart': SystemInfluenceChart,
    'faction-table': FactionTable,
    'system-table': SystemTable,
    'login-card': LoginCard
  },
  mixins: [componentMethods],
  data () {
    return {
      bannedAccess: 'BANNED',
      normalAccess: 'NORMAL',
      adminAccess: 'ADMIN',
      factionsPanel: [],
      factionsDataPanel: [],
      systemsPanel: [],
      systemsDataPanel: []
    }
  },
  created () {
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
      let factionPromises = factions.map(async (faction, index) => {
        let factionsPaginated = await this.$store.dispatch('fetchFactionWithHistoryById', {
          id: faction.id,
          timeMin: Date.now() - 10 * 24 * 60 * 60 * 1000,
          timeMax: Date.now()
        })
        this.factionsPanel.push(index)
        this.factionsDataPanel.push([0, 1])
        return factionsPaginated.docs[0]
      })
      this.setUserFactions(await Promise.all(factionPromises))
      // this.loading = false
    },
    async fetchSystemWithHistoryById () {
      // this.loading = true
      let systems = this.authUser.systems
      systems.sort((first, second) => first.name_lower > second.name_lower)
      let systemPromises = systems.map(async (system, index) => {
        let systemsPaginated = await this.$store.dispatch('fetchSystemWithHistoryById', {
          id: system.id,
          timeMin: Date.now() - 10 * 24 * 60 * 60 * 1000,
          timeMax: Date.now()
        })
        this.systemsPanel.push(index)
        this.systemsDataPanel.push([0, 1])
        return systemsPaginated.docs[0]
      })
      this.setUserSystems(await Promise.all(systemPromises))
      // this.loading = false
    },
    systemDetails (faction) {
      return faction.faction_presence?.map(system => {
        return this.systemDetailsTable(system, faction)
      })
    },
    factionDetails (system) {
      return system.factions?.map(faction => {
        return this.factionDetailsTable(faction, system)
      })
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
