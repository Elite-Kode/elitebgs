<template>
  <highcharts v-if="options" :options="options" ref="chart"></highcharts>
</template>

<script>
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'TickChart',
  data() {
    return {
      options: null
    }
  },
  props: {
    tickData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created() {
    if (this.tickData && !_isEmpty(this.tickData)) {
      this.createChart()
    }
  },
  computed: {
    ...mapGetters({
      className: 'themeClass'
    })
  },
  watch: {
    tickData(newVal, oldVal) {
      if (this.$refs.chart) {
        this.$refs.chart.chart.reflow()
      }
      if (this.tickData && !_isEmpty(this.tickData) && !_isEqual(newVal, oldVal)) {
        this.createChart()
      }
    },
    className() {
      this.createChart()
    }
  },
  methods: {
    async createChart() {
      const data = []
      const series = []
      const firstTick = this.tickData[this.tickData.length - 1]
      this.tickData.forEach((tick) => {
        const tickMoment = moment(tick.time)
        const firstTickMoment = moment(firstTick.time)
        const normalisedTime = moment(
          `${firstTickMoment.format('YYYY-MM-DD')} ${tickMoment.format('HH:mm:ss:SSSZZ')}`,
          'YYYY-MM-DD HH:mm:ss:SSSZZ'
        )
        data.push([Date.parse(tick.time), Date.parse(normalisedTime.toISOString())])
      })
      data.reverse()
      series.push({
        name: 'Tick',
        data: data
      })
      this.options = {
        chart: {
          colorCount: 21,
          className: this.className,
          styledMode: true
        },
        xAxis: { type: 'datetime' },
        yAxis: {
          title: {
            text: 'Time (UTC)'
          },
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M',
            second: '%H:%M',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%H:%M',
            week: '%H:%M',
            month: '%H:%M',
            year: '%H:%M'
          }
        },
        plotOptions: {
          line: {
            tooltip: {
              headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
              pointFormatter() {
                return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${moment(this.y)
                  .utc()
                  .format('HH:mm')} UTC</b><br/>`
              }
            }
          }
        },
        title: { text: 'Tick Trend' },
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
