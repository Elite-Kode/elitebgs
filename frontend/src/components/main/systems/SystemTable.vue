<template>
  <v-data-table
    class="elevation-1"
    :headers="headers"
    :items="tableDetails"
    :items-per-page="tableDetails.length"
    :search="systemFilter"
    hide-default-footer
    :loading="loading"
  >
    <template v-slot:item.name="{ item }">
      <router-link :to="{ name: 'faction-detail', params: { factionId: item.faction_id } }"
        >{{ item.name }}
      </router-link>
    </template>
    <template v-slot:item.active_states="{ item }">
      <v-chip
        v-for="active_state in item.active_states"
        :key="active_state.state"
        dark
        :color="getChipColour(active_state.trend)"
        small
      >
        {{ active_state.state }}
      </v-chip>
    </template>
    <template v-slot:item.pending_states="{ item }">
      <v-chip
        v-for="pending_state in item.pending_states"
        :key="pending_state.state"
        dark
        :color="getChipColour(pending_state.trend)"
        small
      >
        {{ pending_state.state }}
      </v-chip>
    </template>
    <template v-slot:item.recovering_states="{ item }">
      <v-chip
        v-for="recovering_state in item.recovering_states"
        :key="recovering_state.state"
        dark
        :color="getChipColour(recovering_state.trend)"
        small
      >
        {{ recovering_state.state }}
      </v-chip>
    </template>
    <template v-slot:item.influence="{ item }"> {{ item.influence.toFixed(2) }}% </template>
    <template v-slot:item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
      <v-chip small :color="item.isCurrentTick ? 'success' : 'error'" dark>
        {{ item.from_now }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import componentMethods from '@/mixins/componentMethods'

export default {
  name: 'SystemTable',
  data() {
    return {
      headers: [
        {
          text: '👑',
          value: 'is_controlling'
        },
        {
          text: 'Faction Name',
          value: 'name'
        },
        {
          text: 'Influence',
          value: 'influence',
          filterable: false
        },
        {
          text: 'State',
          value: 'state'
        },
        {
          text: 'Happiness',
          value: 'happiness'
        },
        {
          text: 'Active States',
          value: 'active_states',
          filterable: false,
          sortable: false
        },
        {
          text: 'Pending States',
          value: 'pending_states',
          filterable: false,
          sortable: false
        },
        {
          text: 'Recovering States',
          value: 'recovering_states',
          filterable: false,
          sortable: false
        },
        {
          text: 'Last Updated At (UTC)',
          value: 'updated_at',
          filterable: false
        }
      ]
    }
  },
  computed: {
    ...mapState({
      currentTick: (state) => state.ticks.currentTick
    }),
    tableDetails() {
      return this.factionDetails.map((d) => {
        return {
          ...d,
          isCurrentTick: moment(this.currentTick.time).isBefore(moment(d.system_updated_at))
        }
      })
    }
  },
  mixins: [componentMethods],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    factionDetails: {
      type: Array,
      default() {
        return []
      }
    },
    systemFilter: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped></style>
