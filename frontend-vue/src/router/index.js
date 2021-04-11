import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/MainLayout'
import Home from '@/components/main/home/Home'
import Admin from '@/components/admin/Admin'
import Profile from '@/components/profile/Profile'
import About from '@/components/about/About'
import Data from '@/components/profile/Data'
import PrivacyPolicy from '@/components/about/PrivacyPolicy'
import Disclaimer from '@/components/about/Disclaimer'
import TAndC from '@/components/about/TAndC'
import Donate from '@/components/Donate'
import Guide from '@/components/about/Guide'
import SystemList from '@/components/main/systems/SystemList'
import FactionList from '@/components/main/factions/FactionList'
import StationList from '@/components/main/stations/StationList'
import SystemView from '@/components/main/systems/SystemView'
import FactionView from '@/components/main/factions/FactionView'
import StationView from '@/components/main/stations/StationView'
import Tick from '@/components/Tick'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      name: 'main',
      children: [{
        path: '',
        component: Home,
        name: 'home',
        children: [{
          path: 'systems',
          component: SystemList,
          name: 'systems'
        }, {
          path: 'systems/:systemId',
          component: SystemView,
          name: 'system-detail',
          props: true
        }, {
          path: 'factions',
          component: FactionList,
          name: 'factions'
        }, {
          path: 'factions/:factionId',
          component: FactionView,
          name: 'faction-detail',
          props: true
        }, {
          path: 'stations',
          component: StationList,
          name: 'stations'
        }, {
          path: 'stations/:stationId',
          component: StationView,
          name: 'station-detail',
          props: true
        }]
      }, {
        path: '/admin',
        component: Admin,
        name: 'admin'
      }, {
        path: '/tick',
        component: Tick,
        name: 'tick'
      }, {
        path: '/profile',
        component: Profile,
        name: 'profile',
        children: [{
          path: '/',
          component: Data,
          name: 'data'
        }]
      }, {
        path: '/about',
        component: About,
        name: 'about'
      }, {
        path: '/about/termsandconditions',
        component: TAndC,
        name: 'tandc'
      }, {
        path: '/about/disclaimer',
        component: Disclaimer,
        name: 'disclaimer'
      }, {
        path: '/about/privacypolicy',
        component: PrivacyPolicy,
        name: 'privacy-policy'
      }, {
        path: '/donate',
        component: Donate,
        name: 'donate'
      }, {
        path: '/guide',
        component: Guide,
        name: 'guide'
      }
      ]
    }
  ],
  mode: 'history'
})
