<!--
  - KodeBlox Copyright 2020 Sayak Mukhopadhyay
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  - http: //www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
    <ed-toolbar>
        <template v-slot:toolbar-tabs>
            <v-tabs
                v-if="authenticated"
                :show-arrows="$vuetify.breakpoint.xs"
                align-with-title
                background-color="accent"
                light
                slider-color="secondary">
              <!--                  Todo: The to link must be a router name and not link-->
              <v-tab v-for="(tabItem, i) in tabItems" :key="i" :to="tabItem.link">
                    {{ tabItem.name }}
                </v-tab>
            </v-tabs>
        </template>
    </ed-toolbar>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import { mapState } from 'vuex'

export default {
  name: 'ProfileToolbar',
  data () {
    return {
      tabItems: [{
        name: 'Profile',
        link: '/profile'
      }, {
        name: 'Images',
        link: '/profile/images'
      }, {
        name: 'Albums',
        link: '/profile/albums'
      }, {
        name: 'Likes',
        link: '/profile/likes'
      }, {
        name: 'Saves',
        link: '/profile/saves'
      }, {
        name: 'Views',
        link: '/profile/views'
      }]
    }
  },
  components: {
    'ed-toolbar': Toolbar
  },
  computed: {
    ...mapState({
      authenticated: state => state.auth.authenticated,
      authUser: state => state.auth.user
    })
  },
  mounted () {
    this.addPublicProfileTab()
  },
  watch: {
    authUser () {
      this.addPublicProfileTab()
    }
  },
  methods: {
    addPublicProfileTab () {
      if (this.authUser && this.authUser._id) {
        if (this.tabItems.findIndex(item => item.name === 'Public Profile') === -1) {
          this.tabItems.push({
            name: 'Public Profile',
            link: `/users/${this.authUser._id}`
          })
        }
      } else {
        let index = this.tabItems.findIndex(item => item.name === 'Public Profile')
        if (index !== -1) {
          this.tabItems.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

a.v-tab--active.v-tab
    color: map-deep-get($material-light, 'text', 'primary')
</style>
