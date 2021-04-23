import Vue from 'vue'
import Vuex from 'vuex'

import themes from '@/store/modules/themes'
import auth from '@/store/modules/auth'
import ingameIds from '@/store/modules/ingameIds'
import systems from '@/store/modules/systems'
import factions from '@/store/modules/factions'
import stations from '@/store/modules/stations'
import ticks from '@/store/modules/ticks'
import tryApi from '@/store/modules/tryApi'
import users from '@/store/modules/users'
import admin from '@/store/modules/admin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    admin,
    themes,
    auth,
    ingameIds,
    systems,
    factions,
    stations,
    ticks,
    tryApi,
    users
  }
})
