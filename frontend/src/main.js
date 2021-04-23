import Vue from 'vue'
import './plugins/bugsnag'
import './plugins/rx'
import './plugins/meta'
import './plugins/highcharts'
import './plugins/highlightjs'
import './plugins/numeric'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
