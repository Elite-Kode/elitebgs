import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/MainLayout'
import Home from '@/components/main/home/Home'
import Admin from '@/components/admin/Admin'
import Profile from '@/components/profile/Profile'
import About from '@/components/about/About'
import ProfileData from '@/components/profile/ProfileData'
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
import DocsLayout from '@/components/docs/DocsLayout'
import EddbApiOverview from '@/components/docs/eddbApi/EddbApiOverview'
import EddbApiDocs from '@/components/docs/eddbApi/EddbApiDocs'
import EliteBgsApiOverview from '@/components/docs/eliteBgsApi/EliteBgsApiOverview'
import EliteBgsApiDocs from '@/components/docs/eliteBgsApi/EliteBgsApiDocs'
import BgsBotOverview from '@/components/docs/bgsBot/BgsBotOverview'
import BgsBotDocs from '@/components/docs/bgsBot/BgsBotDocs'
import SwaggerHome from '@/components/swagger/SwaggerHome'
import SwaggerPath from '@/components/swagger/SwaggerPath'
import SwaggerDefinition from '@/components/swagger/SwaggerDefinition'
import AdminData from '@/components/admin/AdminData'
import AdminUserList from '@/components/admin/users/AdminUserList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
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
        path: '/eddb',
        component: DocsLayout,
        children: [{
          path: '',
          component: EddbApiOverview,
          name: 'eddb-api-overview'
        }, {
          path: 'docs/:version?',
          component: EddbApiDocs,
          props: true,
          children: [{
            path: '',
            component: SwaggerHome,
            name: 'eddb-api-docs'
          }, {
            path: 'paths/:path/:method?',
            component: SwaggerPath,
            props: true,
            name: 'eddb-api-docs-path'
          }, {
            path: 'definitions/:definition',
            component: SwaggerDefinition,
            props: true,
            name: 'eddb-api-docs-definition'
          }]
        }]
      }, {
        path: '/ebgs',
        component: DocsLayout,
        children: [{
          path: '',
          component: EliteBgsApiOverview,
          name: 'ebgs-api-overview'
        }, {
          path: 'docs/:version?',
          component: EliteBgsApiDocs,
          props: true,
          children: [{
            path: '',
            component: SwaggerHome,
            name: 'ebgs-api-docs'
          }, {
            path: 'paths/:path/:method?',
            component: SwaggerPath,
            props: true,
            name: 'ebgs-api-docs-path'
          }, {
            path: 'definitions/:definition',
            component: SwaggerDefinition,
            props: true,
            name: 'ebgs-api-docs-definition'
          }]
        }]
      }, {
        path: '/bgsbot',
        component: DocsLayout,
        children: [{
          path: '',
          component: BgsBotOverview,
          name: 'bgsbot-api-overview'
        }, {
          path: 'docs',
          component: BgsBotDocs,
          name: 'bgsbot-api-docs'
        }]
      }, {
        path: '/admin',
        component: Admin,
        children: [{
          path: '',
          component: AdminData,
          name: 'admin-data'
        }, {
          path: 'users',
          component: AdminUserList,
          name: 'admin-users'
        }]
      }, {
        path: '/tick',
        component: Tick,
        name: 'tick'
      }, {
        path: '/profile',
        component: Profile,
        children: [{
          path: '',
          component: ProfileData,
          name: 'profile-data'
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
