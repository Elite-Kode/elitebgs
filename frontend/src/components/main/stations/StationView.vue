<template>
  <div>
    <h1>{{ station.name }}</h1>
    <v-btn-toggle multiple max=0>
      <v-btn color="primary" disabled>
        Monitor Station
      </v-btn>
      <v-btn color="primary"
             :href="`https://eddb.io/station/${station.eddb_id}`"
             target="_blank"
             rel="noopener noreferrer"
      >
        EDDB
      </v-btn>
    </v-btn-toggle>
    <v-row class="pt-8">
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Station Type : </b>{{ station.type }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Government : </b>{{ station.government }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Allegiance : </b>{{ station.allegiance }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>State : </b>{{ station.state }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Economy : </b>{{ station.economy }}
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>Controlling Faction : </b>
        <router-link :to="{ name: 'faction-detail', params: { factionId: station.controlling_minor_faction_id }}">
          {{ station.controlling_minor_faction_cased }}
        </router-link>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3">
        <b>System : </b>
        <router-link :to="{ name: 'system-detail', params: { systemId: station.system_id }}">
          {{ station.system }}
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'StationView',
  data () {
    return {
      loading: false,
      filterDates: [],
      changedFilterDates: [],
      datePickerMenu: false,
      currentUtcDate: '',
      dateFormat: 'YYYY-MM-DD'
    }
  },
  props: {
    stationId: {
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
    this.fetchStationWithHistoryById()
  },
  computed: {
    ...mapGetters({
      station: 'friendlyStation'
    }),
    datePickerDisplay () {
      return `${this.filterDates[0]} - ${this.filterDates[1]}`
    }
  },
  methods: {
    ...mapMutations([
      'setSelectedStation'
    ]),
    formatDate (date) {
      return moment(date).utc().format('ddd, MMM D, HH:mm:ss')
    },
    onChangedFilterDates (value) {
      if (value) {
        if (moment(value[0], this.dateFormat).isAfter(moment(value[1], this.dateFormat))) {
          value.reverse()
        }
        this.filterDates = [...value]
      }
    },
    async checkRedirect () {
      if (this.stationId.toLowerCase().startsWith('eddbid-')) {
        let station = await this.$store.dispatch('fetchStationByEddbId', {
          eddbId: this.stationId.slice(7)
        })
        await this.$router.push({ name: 'station-detail', params: { stationId: station.docs[0]._id } })
      }
    },
    async fetchStationWithHistoryById () {
      this.loading = true
      let stationsPaginated = await this.$store.dispatch('fetchStationWithHistoryById', {
        id: this.stationId,
        timeMin: moment.utc(this.filterDates[0], this.dateFormat).toDate().getTime(),
        timeMax: (this.filterDates[1] === moment().format(this.dateFormat) ? moment() : moment(this.filterDates[1], this.dateFormat)).toDate().getTime()
      })
      this.setSelectedStation(stationsPaginated.docs[0])
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
