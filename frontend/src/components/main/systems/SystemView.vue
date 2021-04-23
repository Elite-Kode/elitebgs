<template>
  <div>
    <h1>{{ system.name }}</h1>
    <v-btn-toggle max=0 multiple>
      <v-btn v-if="isMonitored" color="primary" outlined @click="stopMonitor">
        Stop Monitoring
      </v-btn>
      <v-btn v-else color="primary" @click="monitor">
        Monitor System
      </v-btn>
      <v-btn
        :href="`https://eddb.io/system/${system.eddb_id}`"
        color="primary"
        rel="noopener noreferrer"
        target="_blank"
      >
        EDDB
      </v-btn>
    </v-btn-toggle>
    <v-row class="pt-8">
      <v-col cols="12" lg="4" md="6" sm="12" xl="3">
        <b>Government : </b>{{ system.government }}
      </v-col>
      <v-col cols="12" lg="4" md="6" sm="12" xl="3">
        <b>Allegiance : </b>{{ system.allegiance }}
      </v-col>
      <v-col cols="12" lg="4" md="6" sm="12" xl="3">
        <b>Primary Economy : </b>{{ system.primary_economy }}
      </v-col>
      <v-col cols="12" lg="4" md="6" sm="12" xl="3">
        <b>Secondary Economy : </b>{{ system.secondary_economy }}
      </v-col>
      <v-col cols="12" lg="4" md="6" sm="12" xl="3">
        <b>State : </b>{{ system.state }}
      </v-col>
      <v-col cols="12" lg="4" md="6" sm="12" xl="3">
        <b>Security : </b>{{ system.security }}
      </v-col>
      <v-col cols="12" lg="4" md="6" sm="12" xl="3">
        <b>Population : </b>
        <vue-numeric v-model="system.population" read-only/>
      </v-col>
      <v-col cols="12" lg="4" md="6" sm="12" xl="3">
        <b>Controlling Faction : </b>
        <router-link :to="{ name: 'faction-detail', params: { factionId: system.controlling_minor_faction_id }}">
          {{ system.controlling_minor_faction_cased }}
        </router-link>
      </v-col>
    </v-row>
    <v-form>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="systemFilter" hint="Faction name/state/happiness" label="Filter"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <system-table :faction-details="factionDetails" :loading="loading" :system-filter="systemFilter"/>
    <h2 class="py-8">Conflicts</h2>
    <v-expansion-panels
      v-if="system.conflicts && system.conflicts.length>0"
      v-model="conflictsPanel"
      accordion
      focusable
      multiple
    >
      <v-expansion-panel v-for="conflict in system.conflicts" :key="conflict.faction1.faction_id">
        <v-expansion-panel-header>
          {{ conflict.faction1.name }} vs {{ conflict.faction2.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p class="pt-4">Conflict Type: {{ conflict.type }}</p>
          <p>Conflict Status: {{ conflict.status }}</p>
          <v-simple-table class="elevation-1" dense>
            <thead>
            <tr>
              <th>{{ conflict.faction1.name }}</th>
              <th>{{ conflict.faction2.name }}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ getConflictStakeMessage(conflict.faction1.stake) }}</td>
              <td>{{ getConflictStakeMessage(conflict.faction2.stake) }}</td>
            </tr>
            <tr>
              <td>{{ conflict.faction1.days_won }} days won</td>
              <td>{{ conflict.faction2.days_won }} days won</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <p v-else-if="loading">Loading...</p>
    <p v-else>No conflicts in system</p>
    <h2 class="py-8">Date Filter</h2>
    <v-row>
      <v-col cols="12" sm="6">
        <v-menu
          ref="datepickerRef"
          v-model="datePickerMenu"
          :close-on-content-click="false"
          min-width="auto"
          offset-y
          transition="scale-transition"
          @update:return-value="onChangedFilterDates"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-bind="attrs"
              v-on="on"
              :value="datePickerDisplay"
              label="Click to select date range (UTC)"
              prepend-icon="event"
              readonly
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="changedFilterDates"
            :show-current="currentUtcDate"
            range
            show-adjacent-months
          >
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  color="error"
                  text
                  @click="datePickerMenu = false"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  color="success"
                  text
                  @click="$refs.datepickerRef.save(changedFilterDates)"
                >
                  OK
                </v-btn>
              </v-col>
            </v-row>
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>
        Graphs
      </v-card-title>

      <v-expansion-panels v-model="chartsPanel" accordion multiple>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Influences
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <system-influence-chart :system-data="system"></system-influence-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            State Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <system-state-chart :system-data="system"></system-state-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Active State Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <system-state-apr-chart :system-data="system" type="active"></system-state-apr-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Pending State Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <system-state-apr-chart :system-data="system" type="pending"></system-state-apr-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Recovering State Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <system-state-apr-chart :system-data="system" type="recovering"></system-state-apr-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Happiness Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <system-happiness-chart :system-data="system"></system-happiness-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import moment from 'moment'
import SystemInfluenceChart from '@/components/charts/SystemInfluenceChart'
import SystemStateChart from '@/components/charts/SystemStateChart'
import SystemAPRStateChart from '@/components/charts/SystemAPRStateChart'
import SystemHappinessChart from '@/components/charts/SystemHappinessChart'
import componentMethods from '@/mixins/componentMethods'
import SystemTable from '@/components/main/systems/SystemTable'

export default {
  name: 'SystemView',
  components: {
    'system-table': SystemTable,
    'system-influence-chart': SystemInfluenceChart,
    'system-state-chart': SystemStateChart,
    'system-state-apr-chart': SystemAPRStateChart,
    'system-happiness-chart': SystemHappinessChart
  },
  mixins: [componentMethods],
  data () {
    return {
      loading: false,
      systemFilter: '',
      conflictsPanel: [],
      filterDates: [],
      changedFilterDates: [],
      datePickerMenu: false,
      currentUtcDate: '',
      dateFormat: 'YYYY-MM-DD',
      chartsPanel: [0, 1, 2, 3, 4, 5]
    }
  },
  props: {
    systemId: {
      type: String,
      default: ''
    }
  },
  async created () {
    this.filterDates = [
      moment().subtract(10, 'days').utc().format(this.dateFormat),
      moment().utc().format(this.dateFormat)
    ]
    this.changedFilterDates = this.filterDates
    this.currentUtcDate = moment().utc().format(this.dateFormat)
    await this.checkRedirect()
    this.fetchSystemWithHistoryById()
  },
  computed: {
    ...mapGetters({
      system: 'friendlySystem'
    }),
    ...mapState({
      authUser: state => state.auth.user
    }),
    isMonitored () {
      return this.authUser?.systems?.findIndex(system => system.id === this.system._id) !== -1
    },
    factionDetails () {
      return this.system.factions?.map(faction => {
        return this.factionDetailsTable(faction, this.system)
      })
    },
    datePickerDisplay () {
      return `${this.filterDates[0]} - ${this.filterDates[1]}`
    }
  },
  methods: {
    ...mapMutations([
      'setSelectedSystem'
    ]),
    onChangedFilterDates (value) {
      if (value) {
        if (moment(value[0], this.dateFormat).isAfter(moment(value[1], this.dateFormat))) {
          value.reverse()
        }
        this.filterDates = [...value]
      }
      this.fetchSystemWithHistoryById()
    },
    getConflictStakeMessage (stake) {
      if (stake) {
        return `${stake} is at stake`
      } else {
        return `Nothing is at stake`
      }
    },
    async checkRedirect () {
      if (this.systemId.toLowerCase().startsWith('eddbid-')) {
        let system = await this.$store.dispatch('fetchSystemByEddbId', {
          eddbId: this.systemId.slice(7)
        })
        await this.$router.push({ name: 'system-detail', params: { systemId: system.docs[0]._id } })
      }
    },
    async fetchSystemWithHistoryById () {
      this.loading = true
      let systemsPaginated = await this.$store.dispatch('fetchSystemWithHistoryById', {
        id: this.systemId,
        timeMin: moment.utc(this.filterDates[0], this.dateFormat).toDate().getTime(),
        timeMax: (this.filterDates[1] === moment().format(this.dateFormat) ? moment() : moment(this.filterDates[1], this.dateFormat)).toDate().getTime()
      })
      this.setSelectedSystem(systemsPaginated.docs[0])
      this.conflictsPanel = this.system.conflicts.map((conflict, index) => {
        return index
      })
      this.loading = false
    },
    monitor () {
      this.$store.dispatch('saveUserSystems', [this.system._id])
    },
    stopMonitor () {
      this.$store.dispatch('deleteUserSystem', this.system._id)
    }
  }
}
</script>

<style scoped>

</style>
