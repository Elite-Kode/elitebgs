<template>
  <div>
    <h1>Stations</h1>
    <v-form>
      <h4>Filter Station</h4>
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="stationName"
            hint="Carpini Terminal"
            label="Station Name"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="stations"
      :page.sync="page"
      :server-items-length="totalStations"
      :items-per-page="10"
      :footer-props="tableFooter"
      :loading="loading">
      <!--      <template v-slot:item._id="{item}">-->
      <!--        <router-link :to="{ name: 'user-detail', params: { userId: item._id }}">{{ item._id }}</router-link>-->
      <!--      </template>-->
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { debounceTime, switchMap } from 'rxjs/operators'

export default {
  name: 'StationList',
  data () {
    return {
      stationName: '',
      headers: [{
        text: 'Station Name',
        value: 'name'
      }, {
        text: 'System Name',
        value: 'system'
      }, {
        text: 'Station Type',
        value: 'government'
      }, {
        text: 'Station Government',
        value: 'government'
      }, {
        text: 'Allegiance',
        value: 'allegiance'
      }, {
        text: 'Economy',
        value: 'economy'
      }, {
        text: 'State',
        value: 'state'
      }],
      tableFooter: {
        disableItemsPerPage: true,
        showFirstLastPage: true,
        showCurrentPage: true
      },
      page: 1,
      totalStations: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      stations: 'friendlyStations'
    })
  },
  watch: {
    page () {
      this.fetchStations()
    }
  },
  created () {
    this.fetchStations()
    this.$watchAsObservable('stationName')
      .pipe(debounceTime(300))
      .pipe(switchMap(value => {
        this.loading = true
        return this.$store.dispatch('fetchStations', {
          page: this.page,
          minimal: true,
          beginsWith: value.newValue
        })
      }))
      .subscribe(stationsPaginated => {
        this.setStations(stationsPaginated.docs)
        this.totalStations = stationsPaginated.total
        this.loading = false
      })
  },
  methods: {
    ...mapMutations([
      'setStations'
    ]),
    async fetchStations () {
      this.loading = true
      let stationsPaginated = await this.$store.dispatch('fetchStations', {
        page: this.page,
        minimal: true,
        beginsWith: this.stationName
      })
      this.setStations(stationsPaginated.docs)
      this.totalStations = stationsPaginated.total
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
