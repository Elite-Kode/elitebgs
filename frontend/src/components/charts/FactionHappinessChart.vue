<template>
  <highcharts v-if="options" :options="options"></highcharts>
</template>

<script>
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'FactionHappinessChart',
  data() {
    return {
      options: null
    }
  },
  props: {
    factionData: {
      type: Object,
      default() {
        return null
      }
    },
    endDate: {
      type: String,
      default: ''
    }
  },
  created() {
    if (this.factionData && !_isEmpty(this.factionData)) {
      this.createChart()
    }
  },
  computed: {
    ...mapState({
      allIds: (state) => state.ingameIds.allIds
    }),
    ...mapGetters({
      className: 'themeClass'
    })
  },
  watch: {
    factionData(newVal, oldVal) {
      if (this.factionData && !_isEmpty(this.factionData) && !_isEqual(newVal, oldVal)) {
        this.createChart()
      }
    },
    className() {
      this.createChart()
    }
  },
  methods: {
    async getName(){
      return this.factionData.name
    },
    async createChart() {
      const allSystems = []
      this.factionData.history.forEach((record) => {
        if (allSystems.indexOf(record.system) === -1) {
          allSystems.push(record.system)
        }
      })
      this.factionData.history.sort((a, b) => {
        if (a.updated_at < b.updated_at) {
          return -1
        } else if (a.updated_at > b.updated_at) {
          return 1
        } else {
          return 0
        }
      })
      // const series: XRangeChartSeriesOptions[] = [];
      const series = []
      await this.$store.dispatch('fetchAllIds')
      const happinesses = Object.keys(this.allIds.happiness).map((happiness) => {
        return [happiness, this.allIds.happiness[happiness].name]
      })
      // let i = 0
      happinesses.forEach((happiness) => {
        // const data: DataPoint[] = [];
        const data = []
        allSystems.forEach((system, index) => {
          let previousHappiness = ''
          let timeBegin = 0
          let timeEnd = 0
          this.factionData.history.forEach((record) => {
            if (record.system === system) {
              if (previousHappiness !== record.happiness) {
                if (record.happiness === happiness[0]) {
                  timeBegin = Date.parse(record.updated_at)
                }
                if (previousHappiness === happiness[0] && record.happiness !== happiness[0]) {
                  timeEnd = Date.parse(record.updated_at)
                  data.push({
                    x: timeBegin,
                    x2: timeEnd,
                    y: index
                  })
                }
                previousHappiness = record.happiness
              }
            }
          })
          if (previousHappiness === happiness[0]) {
            data.push({
              x: timeBegin,
              x2: this.endDate === '' ? Date.now() : new Date(this.endDate).getTime() + 86400000, // End day is set to the start of the next day
              y: index
            })
          }
        })
        series.push({
          name: happiness[1],
          pointWidth: 20,
          data: data
        })
        // i++
      })
      this.options = {
        chart: {
          colorCount: 21,
          className: this.className,
          height: 130 + allSystems.length * 40,
          type: 'xrange',
          styledMode: true
        },
        title: {
          text: 'Happiness Periods'
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'Systems'
          },
          categories: allSystems,
          reversed: true
        },
        plotOptions: {
          xrange: {
            borderRadius: 0,
            borderWidth: 0,
            grouping: false,
            dataLabels: {
              align: 'center',
              enabled: true,
              format: '{point.name}'
            },
            colorByPoint: false
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size: 0.85em">{point.x} - {point.x2}</span><br/>',
          pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
        },
        series: series,
        exporting: {
          enabled: true,
          sourceWidth: 1200
        }
      }
    }
  }
}
</script>

<style lang="sass">
@import '~@/assets/styles/highcharts/fonts.scss'
@import '~highcharts/css/highcharts'
</style>
