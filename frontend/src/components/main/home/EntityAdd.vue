<template>
  <v-dialog v-model="dialog" max-width="1200" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="primary" v-on="on" v-bind="attrs">
        <v-icon>add</v-icon>
        Add
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="primary theme--dark v-card">
        Search {{ search }}
      </v-card-title>

      <v-card-text>
        <v-autocomplete
          :items="entities"
          cache-items
          item-text="name"
          item-value="_id"
          :label="search"
          multiple
          chips
          v-model="entitiesSelected"
          @update:search-input="searchInputUpdated">
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click:close="remove(data.item)"
            >
              {{ data.item.name }}
            </v-chip>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-divider/>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="error"
          text
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          text
          @click="submit"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { debounceTime, switchMap } from 'rxjs/operators'
import factionMethods from '@/mixins/factionMethods'
import systemMethods from '@/mixins/systemMethods'

export default {
  name: 'EntityAdd',
  mixins: [factionMethods, systemMethods],
  data () {
    return {
      search: '',
      entities: [],
      dialog: false,
      searchInput: '',
      entitiesSelected: []
    }
  },
  props: {
    searchType: {
      type: String,
      validator (value) {
        return ['FACTION', 'SYSTEM', 'STATION'].indexOf(value) !== -1
      }
    }
  },
  created () {
    switch (this.searchType) {
      case 'FACTION': {
        this.search = 'Factions'
        this.fetchFactions()
        break
      }
      case 'SYSTEM': {
        this.search = 'Systems'
        this.fetchSystems()
        break
      }
    }
    this.$watchAsObservable('searchInput')
      .pipe(debounceTime(300))
      .pipe(switchMap(value => {
        switch (this.searchType) {
          case 'FACTION': {
            return this.fetchFactionsCall(1, value.newValue)
          }
          case 'SYSTEM': {
            return this.fetchSystemsCall(1, value.newValue)
          }
        }
      }))
      .subscribe(entitiesPaginated => {
        this.entities = entitiesPaginated.docs
      })
  },
  methods: {
    async fetchFactions () {
      this.entities = (await this.fetchFactionsCall(1, this.searchInput)).docs
    },
    async fetchSystems () {
      this.entities = (await this.fetchSystemsCall(1, this.searchInput)).docs
    },
    searchInputUpdated (value) {
      if (value) {
        this.searchInput = value
      } else {
        this.searchInput = ''
      }
    },
    remove (entity) {
      this.entitiesSelected.splice(this.entitiesSelected.findIndex(select => select === entity._id), 1)
    },
    cancel () {
      this.searchInput = ''
      this.entitiesSelected = []
      this.dialog = false
    },
    async submit () {
      switch (this.searchType) {
        case 'FACTION': {
          await this.$store.dispatch('saveUserFactions', this.entitiesSelected)
          await this.fetchFactions()
          break
        }
        case 'SYSTEM': {
          await this.$store.dispatch('saveUserSystems', this.entitiesSelected)
          await this.fetchSystems()
          break
        }
      }
      this.cancel()
    }
  }
}
</script>

<style scoped>

</style>
