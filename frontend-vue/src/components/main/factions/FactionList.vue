<template>
  <div>
    <h1>Factions</h1>
    <v-form>
      <h4>Filter Faction</h4>
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="factionName"
            hint="Knights of Karma"
            label="Faction Name"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="factions"
      :page.sync="page"
      :server-items-length="totalFactions"
      :items-per-page="10"
      :footer-props="tableFooter"
      :loading="loading">
      <!--      <template v-slot:item._id="{item}">-->
      <!--        <router-link :to="{ name: 'user-detail', params: { userId: item._id }}">{{ item._id }}</router-link>-->
      <!--      </template>-->
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { debounceTime, switchMap } from 'rxjs/operators'

export default {
  name: 'FactionList',
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
  created () {
    this.fetchFactions()
    this.$watchAsObservable('factionName')
      .pipe(debounceTime(300))
      .pipe(switchMap(value => {
        this.loading = true
        return this.$store.dispatch('fetchFactions', {
          page: this.page,
          minimal: true,
          beginsWith: value.newValue
        })
      }))
      .subscribe(factionsPaginated => {
        this.setFactions(factionsPaginated.docs)
        this.totalFactions = factionsPaginated.total
        this.loading = false
      })
  },
  methods: {
    ...mapMutations([
      'setFactions'
    ]),
    async fetchFactions () {
      this.loading = true
      let factionsPaginated = await this.$store.dispatch('fetchFactions', {
        page: this.page,
        minimal: true,
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
