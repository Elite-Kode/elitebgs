<template>
  <highcharts :options="options" ref="chart"></highcharts>
</template>

<script>
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'

export default {
  name: 'FactionInfluenceChart',
  data () {
    return {
      options: {}
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
      this.$refs.chart.chart.reflow()
    }
  },
  watch: {
    factionData (newVal, oldVal) {
      if (this.factionData && !_isEmpty(this.factionData) && !_isEqual(newVal, oldVal)) {
        this.createChart()
        this.$refs.chart.chart.reflow()
      }
    }
  },
  methods: {
    createChart () {
      const history = this.factionData.history
      const allSystems = []
      history.forEach(element => {
        if (allSystems.indexOf(element.system) === -1) {
          allSystems.push(element.system)
        }
      })
      const series = []
      history.sort((a, b) => {
        if (a.updated_at < b.updated_at) {
          return -1
        } else if (a.updated_at > b.updated_at) {
          return 1
        } else {
          return 0
        }
      })
      allSystems.forEach(system => {
        const data = []
        let lastElement
        history.forEach(element => {
          if (element.system === system) {
            data.push([
              Date.parse(element.updated_at),
              Number.parseFloat((element.influence * 100).toFixed(2))
            ])
            lastElement = element
          } else {
            if (element.systems.findIndex(systemElement => {
              return systemElement.name === system
            }) === -1) {
              data.push([Date.parse(element.updated_at), null])
            }
          }
        })
        const latestUpdate = this.factionData.faction_presence.find(findSystem => {
          return findSystem.system_name === system
        })
        if (latestUpdate) {
          data.push([
            Date.parse(latestUpdate.updated_at),
            Number.parseFloat((lastElement.influence * 100).toFixed(2))
          ])
        }
        series.push({
          name: system,
          data: data
        })
      })
      this.options = {
        xAxis: { type: 'datetime' },
        yAxis: {
          title: {
            text: 'Influence'
          }
        },
        title: { text: 'Influence Trend' },
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
