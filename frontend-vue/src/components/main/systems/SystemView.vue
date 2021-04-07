<template>
  <div>
    <h1>{{ system.name }}</h1>
    <v-btn-toggle multiple max=0>
      <v-btn color="primary">
        Monitor System
      </v-btn>
      <v-btn color="primary">
        EDDB
      </v-btn>
    </v-btn-toggle>
    <v-row class="pt-8">
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Government : </b>{{ system.government }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Allegiance : </b>{{ system.allegiance }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Primary Economy : </b>{{ system.primary_economy }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Secondary Economy : </b>{{ system.secondary_economy }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>State : </b>{{ system.state }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Security : </b>{{ system.security }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Population : </b>{{ system.population }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
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
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="faction_details"
      :search="systemFilter"
      hide-default-footer
      :loading="loading">
      <template v-slot:item.name="{item}">
        <router-link :to="{ name: 'faction-detail', params: { factionId: item.faction_id }}">{{
            item.name
          }}
        </router-link>
      </template>
      <template v-slot:item.active_states="{item}">
        <v-chip
          v-for="active_state in item.active_states"
          :key="active_state.state"
          color="blue"
          x-small>
          {{ active_state.state }}
        </v-chip>
      </template>
      <template v-slot:item.pending_states="{item}">
        <v-chip
          v-for="pending_state in item.pending_states"
          :key="pending_state.state"
          :color="getChipColour(pending_state.trend)"
          x-small>
          {{ pending_state.state }}
        </v-chip>
      </template>
      <template v-slot:item.recovering_states="{item}">
        <v-chip
          v-for="recovering_state in item.recovering_states"
          :key="recovering_state.state"
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
        <v-chip small :color="item.age_flag">
          {{ item.from_now }}
        </v-chip>
      </template>
    </v-data-table>
    <h2 class="py-8">Conflicts</h2>
    <v-expansion-panels focusable accordion multiple v-model="conflictsPanel">
      <v-expansion-panel v-for="conflict in system.conflicts" :key="conflict.faction1.faction_id">
        <v-expansion-panel-header>
          {{ conflict.faction1.name }} vs {{ conflict.faction2.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p class="pt-4">Conflict Type: {{ conflict.type }}</p>
          <p>Conflict Status: {{ conflict.status }}</p>
          <v-simple-table dense class="elevation-1">
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
    <h2 class="py-8">Date Filter</h2>
    <v-row>
      <v-col cols="12" sm="6">
        <v-menu
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Click to select date range"
              prepend-icon="event"
              readonly
              :value="datePickerDisplay"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filterDates"
            range
            show-adjacent-months
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'SystemView',
  data () {
    return {
      fromDateFilter: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      toDateFilter: new Date(Date.now()),
      loading: false,
      systemFilter: '',
      conflictsPanel: [],
      filterDates: [],
      headers: [{
        text: '👑',
        value: 'is_controlling'
      }, {
        text: 'Faction Name',
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
        text: 'Last Updated At (UTC)',
        value: 'updated_at',
        filterable: false
      }]
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
      moment().subtract(10, 'days').utc().format('YYYY-MM-DD'),
      moment().utc().format('YYYY-MM-DD')
    ]
    await this.checkRedirect()
    this.fetchSystemWithHistoryById()
  },
  computed: {
    ...mapGetters({
      system: 'friendlySystem'
    }),
    faction_details () {
      return this.system.factions?.map(faction => {
        return {
          ...faction.faction_details.faction_presence,
          is_controlling: faction.faction_id === this.system.controlling_minor_faction_id ? '👑' : '',
          influence: faction.faction_details.faction_presence.influence * 100,
          name: faction.name,
          faction_id: faction.faction_id,
          from_now: moment(faction.faction_details.faction_presence.updated_at).fromNow(true),
          age_flag: this.getChipColour(-(moment().diff(moment(faction.faction_details.faction_presence.updated_at), 'days', true) - 1))
        }
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
    formatDate (date) {
      return moment(date).utc().format('ddd, MMM D, HH:mm:ss')
    },
    getChipColour (value) {
      if (value === 0) {
        return 'blue'
      } else if (value > 0) {
        return 'green'
      } else {
        return 'red'
      }
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
        timeMin: moment(this.filterDates[0], 'YYYY-MM-DD'),
        timeMax: moment(this.filterDates[1], 'YYYY-MM-DD')
      })
      this.setSelectedSystem(systemsPaginated.docs[0])
      this.conflictsPanel = this.system.conflicts.map((conflict, index) => {
        return index
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
