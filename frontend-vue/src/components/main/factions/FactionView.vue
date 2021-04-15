<template>
  <div>
    <h1>{{ faction.name }}</h1>
    <v-btn-toggle multiple max=0>
      <v-btn color="primary">
        Monitor Faction
      </v-btn>
      <v-btn color="primary">
        EDDB
      </v-btn>
    </v-btn-toggle>
    <v-row class="pt-8">
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Government : </b>{{ faction.government }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Allegiance : </b>{{ faction.allegiance }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Systems Presence : </b>{{ systemsPresence }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Systems Controlled : </b>{{ systemsControlled }}
      </v-col>
    </v-row>
    <v-form>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="factionFilter" hint="Faction name/state/happiness" label="Filter"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="system_details"
      :search="factionFilter"
      hide-default-footer
      :loading="loading">
      <template v-slot:item.name="{item}">
        <router-link :to="{ name: 'system-detail', params: { systemId: item.system_id }}">{{
            item.name
          }}
        </router-link>
      </template>
      <template v-slot:item.active_states="{item}">
        <v-chip
          v-for="active_state in item.active_states"
          :key="active_state.state"
          dark
          :color="getChipColour(active_state.trend)"
          x-small>
          {{ active_state.state }}
        </v-chip>
      </template>
      <template v-slot:item.pending_states="{item}">
        <v-chip
          v-for="pending_state in item.pending_states"
          :key="pending_state.state"
          dark
          :color="getChipColour(pending_state.trend)"
          x-small>
          {{ pending_state.state }}
        </v-chip>
      </template>
      <template v-slot:item.recovering_states="{item}">
        <v-chip
          v-for="recovering_state in item.recovering_states"
          :key="recovering_state.state"
          dark
          :color="getChipColour(recovering_state.trend)"
          x-small>
          {{ recovering_state.state }}
        </v-chip>
      </template>
      <template v-slot:item.influence="{item}">
        {{ item.influence.toFixed(2) }}%
      </template>
      <template v-slot:item.updated_at="{item}">
        {{ formatDate(item.updated_at) }}
        <v-chip small :color="item.age_flag" dark>
          {{ item.from_now }}
        </v-chip>
      </template>
    </v-data-table>
    <h2 class="py-8">Conflicts</h2>
    <v-data-table
      dense
      :headers="conflictHeaders"
      :items="conflicts"
      class="elevation-1"
      hide-default-footer
      v-if="conflicts && conflicts.length>0"
    >
      <template v-slot:item.stake="{item}">
        {{ getConflictStakeMessage(item.stake) }}
      </template>
      <template v-slot:item.days_won="{item}">
        <template v-if="item.days_won">
          {{ item.days_won }}
        </template>
        <template v-else>
          0
        </template>
      </template>
    </v-data-table>
    <p v-else-if="loading">Loading...</p>
    <p v-else>Faction not in a conflict anywhere</p>
    <h2 class="py-8">Date Filter</h2>
    <v-row>
      <v-col cols="12" sm="6">
        <v-menu
          ref="datepickerRef"
          v-model="datePickerMenu"
          transition="scale-transition"
          offset-y
          offset-x
          @update:return-value="onChangedFilterDates"
          min-width="auto"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="Click to select date range (UTC)"
              prepend-icon="event"
              readonly
              :value="datePickerDisplay"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="changedFilterDates"
            range
            :show-current="currentUtcDate"
            show-adjacent-months
          >
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  text
                  color="error"
                  @click="datePickerMenu = false"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  text
                  color="success"
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
      <v-expansion-panels accordion multiple v-model="chartsPanel">
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Influences
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <faction-influence-chart :faction-data="faction"></faction-influence-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            State Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <faction-state-chart :faction-data="faction"></faction-state-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Active State Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <faction-state-apr-chart :faction-data="faction" type="active"></faction-state-apr-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Pending State Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <faction-state-apr-chart :faction-data="faction" type="pending"></faction-state-apr-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Recovering State Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <faction-state-apr-chart :faction-data="faction" type="recovering"></faction-state-apr-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="py-0">
            Happiness Periods
          </v-expansion-panel-header>
          <v-expansion-panel-content class="custom-padding">
            <faction-happiness-chart :faction-data="faction"></faction-happiness-chart>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import FactionInfluenceChart from '@/components/charts/FactionInfluenceChart'
import FactionStateChart from '@/components/charts/FactionStateChart'
import FactionAPRStateChart from '@/components/charts/FactionAPRStateChart'
import FactionHappinessChart from '@/components/charts/FactionHappinessChart'

export default {
  name: 'FactionView',
  components: {
    'faction-influence-chart': FactionInfluenceChart,
    'faction-state-chart': FactionStateChart,
    'faction-state-apr-chart': FactionAPRStateChart,
    'faction-happiness-chart': FactionHappinessChart
  },
  data () {
    return {
      loading: false,
      conflicts: [],
      systemsPresence: 0,
      systemsControlled: 0,
      factionFilter: '',
      conflictsPanel: [],
      filterDates: [],
      changedFilterDates: [],
      datePickerMenu: false,
      currentUtcDate: '',
      dateFormat: 'YYYY-MM-DD',
      headers: [{
        text: '👑',
        value: 'controlling'
      }, {
        text: 'System Name',
        value: 'name'
      }, {
        text: 'Influence',
        value: 'influence',
        filterable: false
      }, {
        text: 'State',
        value: 'state'
      }, {
        text: 'Happiness',
        value: 'happiness'
      }, {
        text: 'Active States',
        value: 'active_states',
        filterable: false,
        sortable: false
      }, {
        text: 'Pending States',
        value: 'pending_states',
        filterable: false,
        sortable: false
      }, {
        text: 'Recovering States',
        value: 'recovering_states',
        filterable: false,
        sortable: false
      }, {
        text: 'Population',
        value: 'population',
        filterable: false
      }, {
        text: 'Last Updated At (UTC)',
        value: 'updated_at',
        filterable: false
      }],
      conflictHeaders: [{
        text: 'System Name',
        value: 'system_name'
      }, {
        text: 'Conflict Type',
        value: 'type'
      }, {
        text: 'Conflict Status',
        value: 'status'
      }, {
        text: 'Opponent Name',
        value: 'opponent_name'
      }, {
        text: 'Stake',
        value: 'stake'
      }, {
        text: 'Days Won',
        value: 'days_won'
      }],
      chartsPanel: [0, 1, 2, 3, 4, 5]
    }
  },
  props: {
    factionId: {
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
    this.fetchFactionWithHistoryById()
  },
  computed: {
    ...mapGetters({
      faction: 'friendlyFaction'
    }),
    system_details () {
      return this.faction.faction_presence?.map(system => {
        return {
          ...system,
          controlling: system.system_details.controlling_minor_faction_id === this.faction._id ? '👑' : '',
          influence: system.influence * 100,
          name: system.system_name,
          population: system.system_details.population,
          system_id: system.system_id,
          from_now: moment(system.updated_at).fromNow(true),
          age_flag: this.getChipColour(-(moment().diff(moment(system.updated_at), 'days', true) - 1))
        }
      })
    },
    datePickerDisplay () {
      return `${this.filterDates[0]} - ${this.filterDates[1]}`
    }
  },
  methods: {
    ...mapMutations([
      'setSelectedFaction'
    ]),
    formatDate (date) {
      return moment(date).utc().format('ddd, MMM D, HH:mm:ss')
    },
    getChipColour (value) {
      if (value === 0) {
        return 'info'
      } else if (value > 0) {
        return 'success'
      } else {
        return 'error'
      }
    },
    onChangedFilterDates (value) {
      if (value) {
        if (moment(value[0], this.dateFormat).isAfter(moment(value[1], this.dateFormat))) {
          value.reverse()
        }
        this.filterDates = [...value]
      }
      this.fetchFactionWithHistoryById()
    },
    getConflictStakeMessage (stake) {
      if (stake) {
        return `${stake} is at stake`
      } else {
        return `Nothing is at stake`
      }
    },
    async checkRedirect () {
      if (this.factionId.toLowerCase().startsWith('eddbid-')) {
        let faction = await this.$store.dispatch('fetchFactionByEddbId', {
          eddbId: this.factionId.slice(7)
        })
        await this.$router.push({ name: 'faction-detail', params: { factionId: faction.docs[0]._id } })
      }
    },
    async fetchFactionWithHistoryById () {
      this.loading = true
      let factionsPaginated = await this.$store.dispatch('fetchFactionWithHistoryById', {
        id: this.factionId,
        timeMin: moment.utc(this.filterDates[0], this.dateFormat).toDate().getTime(),
        timeMax: (this.filterDates[1] === moment().format(this.dateFormat) ? moment() : moment(this.filterDates[1], this.dateFormat)).toDate().getTime()
      })
      this.setSelectedFaction(factionsPaginated.docs[0])
      this.conflicts = this.faction.faction_presence.reduce((acc, system) => {
        return acc.concat(system.conflicts)
      }, [])
      this.systemsPresence = this.faction.faction_presence.length
      this.systemsControlled = this.faction.faction_presence.reduce((count, system) => {
        if (system.controlling) {
          return count + 1
        } else {
          return count
        }
      }, 0)
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
