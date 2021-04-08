<template>
  <div>
    <h1>Factions</h1>
    <v-form>
      <h4>Filter Faction</h4>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="factionName" hint="Knights of Karma" label="Faction Name"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="factions"
      :page.sync="page"
      :server-items-length="totalFactions"
      :items-per-page="10"
      :footer-props="tableFooter"
      :loading="loading">
      <template v-slot:item.name="{item}">
        <router-link :to="{ name: 'faction-detail', params: { factionId: item._id }}">{{ item.name }}</router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { debounceTime, switchMap } from 'rxjs/operators'

export default {
  name: 'FactionList',
  // Todo: See issue https://github.com/vuetifyjs/vuetify/issues/13378
  // metaInfo: {
  //   title: 'Faction Search - Elite BGS'
  // },
  data () {
    return {
      factionName: '',
      headers: [{
        text: 'Faction Name',
        value: 'name'
      }, {
        text: 'Faction Government',
        value: 'government'
      }, {
        text: 'Allegiance',
        value: 'allegiance'
      }],
      tableFooter: {
        disableItemsPerPage: true,
        showFirstLastPage: true,
        showCurrentPage: true
      },
      page: 1,
      totalFactions: 0,
      loading: false
    }
  },
  created () {
    this.fetchFactions()
    this.$watchAsObservable('factionName')
      .pipe(debounceTime(300))
      .pipe(switchMap(value => {
        this.loading = true
        return this.$store.dispatch('fetchFactions', {
          page: this.page,
          beginsWith: value.newValue
        })
      }))
      .subscribe(factionsPaginated => {
        this.setFactions(factionsPaginated.docs)
        this.totalFactions = factionsPaginated.total
        this.loading = false
      })
  },
  computed: {
    ...mapGetters({
      factions: 'friendlyFactions'
    })
  },
  watch: {
    page () {
      this.fetchFactions()
    }
  },
  methods: {
    ...mapMutations([
      'setFactions'
    ]),
    async fetchFactions () {
      this.loading = true
      let factionsPaginated = await this.$store.dispatch('fetchFactions', {
        page: this.page,
        beginsWith: this.factionName
      })
      this.setFactions(factionsPaginated.docs)
      this.totalFactions = factionsPaginated.total
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
