<template>
  <div>
    <ed-toolbar>
    </ed-toolbar>
    <v-main>
      <v-container fluid>
        <h1>Tick</h1>
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
        <v-data-table
          :footer-props="tableFooter"
          :headers="headers"
          :items="ticks"
          :items-per-page="10"
          :loading="loading"
          class="elevation-1"
          dense>
        </v-data-table>
        <v-card>
          <v-card-title>
            Graphs
          </v-card-title>
          <v-expansion-panels v-model="chartsPanel" accordion multiple>
            <v-expansion-panel>
              <v-expansion-panel-header class="py-0">
                Tick Trend
              </v-expansion-panel-header>
              <v-expansion-panel-content class="custom-padding">
                <tick-chart :tick-data="ticks"></tick-chart>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import moment from 'moment'
import { mapState } from 'vuex'
import TickChart from '@/components/charts/TickChart'

export default {
  name: 'Tick',
  components: {
    'ed-toolbar': Toolbar,
    'tick-chart': TickChart
  },
  data () {
    return {
      loading: false,
      filterDates: [],
      changedFilterDates: [],
      datePickerMenu: false,
      currentUtcDate: '',
      dateFormat: 'YYYY-MM-DD',
      headers: [{
        text: 'Tick At (UTC)',
        value: 'time_formatted',
        filterable: false,
        sortable: false
      }, {
        text: 'Tick At (Local)',
        value: 'time_local',
        filterable: false,
        sortable: false
      }, {
        text: 'Last Updated At (UTC)',
        value: 'updated_at_formatted',
        filterable: false,
        sortable: false
      }],
      tableFooter: {
        disableItemsPerPage: true,
        showFirstLastPage: true,
        showCurrentPage: true
      },
      chartsPanel: [0]
    }
  },
  async created () {
    this.filterDates = [
      moment().subtract(10, 'days').utc().format(this.dateFormat),
      moment().utc().format(this.dateFormat)
    ]
    this.changedFilterDates = this.filterDates
    this.currentUtcDate = moment().utc().format(this.dateFormat)
    this.fetchTicks()
  },
  computed: {
    ...mapState({
      ticks: state => state.ticks.ticks
    }),
    datePickerDisplay () {
      return `${this.filterDates[0]} - ${this.filterDates[1]}`
    }
  },
  methods: {
    onChangedFilterDates (value) {
      if (value) {
        if (moment(value[0], this.dateFormat).isAfter(moment(value[1], this.dateFormat))) {
          value.reverse()
        }
        this.filterDates = [...value]
      }
      this.fetchTicks()
    },
    async fetchTicks () {
      this.loading = true
      await this.$store.dispatch('fetchTicks', {
        timeMin: moment.utc(this.filterDates[0], this.dateFormat).toDate().getTime(),
        timeMax: (this.filterDates[1] === moment().format(this.dateFormat) ? moment() : moment(this.filterDates[1], this.dateFormat)).toDate().getTime()
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
