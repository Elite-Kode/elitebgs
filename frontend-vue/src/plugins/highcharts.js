import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import xrangeInit from 'highcharts/modules/xrange'

exportingInit(Highcharts)
xrangeInit(Highcharts)

Vue.use(HighchartsVue)
