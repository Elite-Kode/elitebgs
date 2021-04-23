<template>
  <highcharts v-if="options" :options="options"></highcharts>
</template>

<script>
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import { mapState } from 'vuex'

export default {
  name: 'FactionStateChart',
  data () {
    return {
      options: null
    }
  },
  props: {
    factionData: {
      type: Object,
      default () {
        return null
      }
    }
  },
  created () {
    if (this.factionData && !_isEmpty(this.factionData)) {
      this.createChart()
    }
  },
  computed: {
    ...mapState({
      allIds: state => state.ingameIds.allIds
    })
  },
  watch: {
    factionData (newVal, oldVal) {
      if (this.factionData && !_isEmpty(this.factionData) && !_isEqual(newVal, oldVal)) {
        this.createChart()
      }
    }
  },
  methods: {
    async createChart () {
      const allSystems = []
      this.factionData.history.forEach(record => {
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
      const states = Object.keys(this.allIds.state).filter(state => {
        return state !== 'null'
      }).map(state => {
        return [state, this.allIds.state[state].name]
      })
      // let i = 0
      states.forEach(state => {
        // const data: DataPoint[] = [];
        const data = []
        allSystems.forEach((system, index) => {
          let previousState = ''
          let timeBegin = 0
          let timeEnd = 0
          this.factionData.history.forEach(record => {
            if (record.system === system) {
              if (previousState !== record.state) {
                if (record.state === state[0]) {
                  timeBegin = Date.parse(record.updated_at)
                }
                if (previousState === state[0] && record.state !== state[0]) {
                  timeEnd = Date.parse(record.updated_at)
                  data.push({
                    x: timeBegin,
                    x2: timeEnd,
                    y: index
                  })
                }
                previousState = record.state
              }
            }
          })
          if (previousState === state[0]) {
            data.push({
              x: timeBegin,
              x2: Date.now(),
              y: index
            })
          }
        })
        series.push({
          name: state[1],
          pointWidth: 20,
          data: data
        })
        // i++
      })
      this.options = {
        chart: {
          colorCount: 21,
          height: 130 + allSystems.length * 40,
          type: 'xrange',
          styledMode: true
        },
        title: {
          text: 'State Periods'
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

<style scoped>

</style>
