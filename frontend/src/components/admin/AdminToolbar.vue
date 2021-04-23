<!--
  - KodeBlox Copyright 2021 Sayak Mukhopadhyay
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
        :show-arrows="$vuetify.breakpoint.xs"
        align-with-title
        background-color="accent"
        light
        slider-color="secondary"
      >
        <v-tab v-for="(tabItem, i) in tabItems" :key="i" :to="{name: tabItem.link}">
          {{ tabItem.name }}
        </v-tab>
      </v-tabs>
    </template>
  </ed-toolbar>
</template>

<script>
import Toolbar from '@/components/Toolbar'

export default {
  name: 'AdminToolbar',
  data () {
    return {
      tabItems: [{
        name: 'Overview',
        link: 'admin-data'
      }, {
        name: 'Users',
        link: 'admin-users'
      }]
    }
  },
  components: {
    'ed-toolbar': Toolbar
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

a.v-tab--active.v-tab
  color: map-deep-get($material-light, 'text', 'primary')
</style>
