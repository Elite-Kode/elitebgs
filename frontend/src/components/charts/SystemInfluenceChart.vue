<template>
  <highcharts v-if="options" :options="options" ref="chart"></highcharts>
</template>

<script>
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'

export default {
  name: 'SystemInfluenceChart',
  data () {
    return {
      options: null
    }
  },
  props: {
    systemData: {
      type: Object,
      default () {
        return null
      }
    }
  },
  created () {
    if (this.systemData && !_isEmpty(this.systemData)) {
      this.createChart()
    }
  },
  watch: {
    systemData (newVal, oldVal) {
      if (this.$refs.chart) {
        this.$refs.chart.chart.reflow()
      }
      if (this.systemData && !_isEmpty(this.systemData) && !_isEqual(newVal, oldVal)) {
        this.createChart()
      }
    }
  },
  methods: {
    createChart () {
      const allTimeFactions = []
      this.systemData.faction_history.forEach(record => {
        if (allTimeFactions.indexOf(record.faction_name) === -1) {
          allTimeFactions.push(record.faction_name)
        }
      })
      this.systemData.faction_history.sort((a, b) => {
        if (a.updated_at < b.updated_at) {
          return -1
        } else if (a.updated_at > b.updated_at) {
          return 1
        } else {
          return 0
        }
      })
      const series = []
      allTimeFactions.forEach(faction => {
        const data = []
        let lastRecord
        this.systemData.faction_history.forEach(record => {
          if (record.faction_name === faction) {
            data.push([
              Date.parse(record.updated_at),
              Number.parseFloat((record.influence * 100).toFixed(2))
            ])
            lastRecord = record
          } else {
            const indexInSystem = this.systemData.history.findIndex(element => {
              return element.updated_at === record.updated_at
            })
            if (indexInSystem !== -1 && this.systemData.history[indexInSystem].factions.findIndex(element => {
              return element.name_lower === faction.toLowerCase()
            }) === -1) {
              data.push([Date.parse(record.updated_at), null])
            }
          }
        })
        const latestUpdate = this.systemData.factions.find(findFaction => {
          return findFaction.name === faction
        })
        if (latestUpdate) {
          data.push([
            Date.parse(latestUpdate.faction_details.faction_presence.updated_at),
            Number.parseFloat((lastRecord.influence * 100).toFixed(2))
          ])
        }
        series.push({
          name: faction,
          data: data
        })
      })
      this.options = {
        chart: {
          colorCount: 21,
          styledMode: true
        },
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
