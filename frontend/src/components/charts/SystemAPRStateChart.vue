<template>
  <highcharts v-if="options" :options="options"></highcharts>
</template>

<script>
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _difference from 'lodash/difference'
import _pull from 'lodash/pull'
import _sum from 'lodash/sum'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'SystemAPRStateChart',
  data() {
    return {
      options: null
    }
  },
  props: {
    systemData: {
      type: Object,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    }
  },
  created() {
    if (this.systemData && !_isEmpty(this.systemData)) {
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
    systemData(newVal, oldVal) {
      if (this.systemData && !_isEmpty(this.systemData) && !_isEqual(newVal, oldVal)) {
        this.createChart()
      }
    },
    className() {
      this.createChart()
    },
    endDate() {
      this.createChart()
    }
  },
  methods: {
    async createChart() {
      let stateType
      let stateTitle
      switch (this.type) {
        case 'active':
          stateType = 'active_states'
          stateTitle = 'Active State'
          break
        case 'pending':
          stateType = 'pending_states'
          stateTitle = 'Pending State'
          break
        case 'recovering':
          stateType = 'recovering_states'
          stateTitle = 'Recovering State'
          break
        default:
          stateType = 'pending_states'
          stateTitle = 'Pending State'
      }
      const allTimeFactions = []
      const allTimeStates = []
      const maxStatesConcurrent = []
      const factions = []
      this.systemData.faction_history.forEach((record) => {
        if (allTimeFactions.indexOf(record.faction_name) === -1) {
          allTimeFactions.push(record.faction_name)
        }
      })
      console.log(data)
      this.systemData.faction_history.sort((a, b) => {
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
      const states = Object.keys(this.allIds.state)
        .filter((state) => {
          return state !== 'null'
        })
        .map((state) => {
          return [state, this.allIds.state[state].name]
        })
      const data = {}
      states.forEach((state) => {
        data[state[0]] = []
      })
      allTimeFactions.forEach((faction, index) => {
        factions.push(faction)
        const previousStates = new Array(maxStatesConcurrent[index])
        const tempBegin = new Array(maxStatesConcurrent[index])
        this.systemData.faction_history
          .filter((record) => {
            return record.faction_name === faction
          })
          .forEach((record) => {
            if (
              record[stateType] &&
              !_isEqual(
                record[stateType].map((recordState) => {
                  return recordState.state
                }),
                previousStates
              )
            ) {
              const statesStarting = _pull(
                _difference(
                  record[stateType].map((recordState) => {
                    return recordState.state
                  }),
                  previousStates
                ),
                undefined,
                null
              )
              const statesEnding = _pull(
                _difference(
                  previousStates,
                  record[stateType].map((recordState) => {
                    return recordState.state
                  })
                ),
                undefined,
                null
              )
              statesEnding.forEach((state) => {
                const previousStateIndex = previousStates.indexOf(state)
                data[state].push({
                  x: tempBegin[previousStateIndex],
                  x2: Date.parse(record.updated_at),
                  y: _sum(maxStatesConcurrent.slice(0, index)) + previousStateIndex,
                  faction: faction
                })
                previousStates[previousStateIndex] = null
              })
              statesStarting.forEach((state) => {
                for (let i = 0; i < previousStates.length; i++) {
                  if (!previousStates[i]) {
                    previousStates[i] = state
                    tempBegin[i] = Date.parse(record.updated_at)
                    break
                  }
                }
              })
            }
          })
        previousStates.forEach((state, previousStateIndex) => {
          if (state) {
            data[state].push({
              x: tempBegin[previousStateIndex],
              x2: this.endDate === '' ? Date.now() : new Date(this.endDate).getTime() + 86400000, // End day is set to the start of the next day
              y: _sum(maxStatesConcurrent.slice(0, index)) + previousStateIndex,
              faction: faction
            })
            previousStates[previousStateIndex] = null
          }
        })
      })
      states.forEach((state) => {
        series.push({
          name: state[1],
          pointWidth: 20,
          data: data[state[0]]
        })
      })
      const tickPositions = [-1]
      for (let i = 0; i < maxStatesConcurrent.length; i++) {
        tickPositions.push(tickPositions[i] + maxStatesConcurrent[i])
      }
      this.options = {
        chart: {
          colorCount: 21,
          className: this.className,
          height: 130 + _sum(maxStatesConcurrent) * 40,
          type: 'xrange',
          events: {
            render() {
              let tickAbsolutePositions = this.yAxis[0].tickPositions.map((tickPosition) => {
                return +this.yAxis[0].ticks[tickPosition.toString()].gridLine.d.split(' ')[2]
              })
              tickAbsolutePositions = [+this.yAxis[0].ticks['-1'].gridLine.d.split(' ')[2]].concat(
                tickAbsolutePositions
              )
              const labelPositions = []
              for (let i = 1; i < tickAbsolutePositions.length; i++) {
                labelPositions.push((tickAbsolutePositions[i] + tickAbsolutePositions[i - 1]) / 2)
              }

              factions.forEach((faction, index) => {
                this.yAxis[0].labelGroup.element.childNodes[index].attributes.y.nodeValue =
                  labelPositions[index] + 12 / 2 // 12 is the font size in px of the y-axis labels
              })
            }
          },
          styledMode: true
        },
        title: {
          text: `${stateTitle} Periods`
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'Factions'
          },
          categories: factions,
          tickPositioner() {
            return tickPositions
          },
          startOnTick: false,
          reversed: true,
          labels: {
            formatter() {
              const chart = this.chart
              const axis = this.axis
              let label

              if (!chart.yaxisLabelIndex) {
                chart.yaxisLabelIndex = 0
              }
              if (this.value !== -1) {
                label = axis.categories[chart.yaxisLabelIndex]
                chart.yaxisLabelIndex++

                if (chart.yaxisLabelIndex === maxStatesConcurrent.length) {
                  chart.yaxisLabelIndex = 0
                }

                return label
              }
            }
          }
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
          pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.faction}</b><br/>'
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
