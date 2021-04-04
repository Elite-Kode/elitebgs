<template>
  <div>
    <h1>Systems</h1>

    <v-form>
      <h4>Filter System</h4>
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="systemName"
            hint="Qa'wakana"
            label="System Name"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="systems"
      :page.sync="page"
      :server-items-length="totalSystems"
      :items-per-page="10"
      :footer-props="tableFooter"
      :loading="loading">
      <!--      <template v-slot:item._id="{item}">-->
      <!--        <router-link :to="{ name: 'user-detail', params: { userId: item._id }}">{{ item._id }}</router-link>-->
      <!--      </template>-->
    </v-data-table>
  </div>
  <!--    <form clrForm [formGroup]="systemForm" novalidate>-->
  <!--        <h4>Filter System</h4>-->
  <!--        <clr-input-container>-->
  <!--            <label for="systemName">System Name</label>-->
  <!--            <input clrInput type="text" id="systemName" placeholder="Qa'wakana" formControlName="systemName">-->
  <!--        </clr-input-container>-->
  <!--    </form>-->
  <!--    <clr-datagrid (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading">-->
  <!--        <clr-dg-column>System Name</clr-dg-column>-->
  <!--        <clr-dg-column>System Government</clr-dg-column>-->
  <!--        <clr-dg-column>Allegiance</clr-dg-column>-->
  <!--        <clr-dg-column>Primary Economy</clr-dg-column>-->
  <!--        <clr-dg-column>Secondary Economy</clr-dg-column>-->
  <!--        <clr-dg-column>State</clr-dg-column>-->

  <!--        <clr-dg-placeholder>Unable to find any systems!</clr-dg-placeholder>-->

  <!--        <clr-dg-row *ngFor="let system of systemData">-->
  <!--            <clr-dg-cell><a routerLink="/system/{{system.id}}">{{system.name}}</a></clr-dg-cell>-->
  <!--            <clr-dg-cell>{{system.government}}</clr-dg-cell>-->
  <!--            <clr-dg-cell>{{system.allegiance}}</clr-dg-cell>-->
  <!--            <clr-dg-cell>{{system.primary_economy}}</clr-dg-cell>-->
  <!--            <clr-dg-cell>{{system.secondary_economy}}</clr-dg-cell>-->
  <!--            <clr-dg-cell>{{system.state}}</clr-dg-cell>-->
  <!--        </clr-dg-row>-->

  <!--        <clr-dg-footer>-->
  <!--            {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} of {{totalRecords}} systems-->
  <!--            <clr-dg-pagination #pagination [clrDgTotalItems]="totalRecords"></clr-dg-pagination>-->
  <!--        </clr-dg-footer>-->
  <!--    </clr-datagrid>-->
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { debounceTime, switchMap } from 'rxjs/operators'

export default {
  name: 'SystemList',
  data () {
    return {
      systemName: '',
      headers: [{
        text: 'System Name',
        value: 'name'
      }, {
        text: 'System Government',
        value: 'government'
      }, {
        text: 'Allegiance',
        value: 'allegiance'
      }, {
        text: 'Primary Economy',
        value: 'primary_economy'
      }, {
        text: 'Secondary Economy',
        value: 'secondary_economy'
      }, {
        text: 'State',
        value: 'state'
      }],
      tableFooter: {
        disableItemsPerPage: true,
        showFirstLastPage: true,
        showCurrentPage: true
      },
      page: 1,
      totalSystems: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      systems: 'friendlySystems'
    })
  },
  watch: {
    page () {
      this.fetchSystems()
    }
  },
  created () {
    this.fetchSystems()
    this.$watchAsObservable('systemName')
      .pipe(debounceTime(300))
      .pipe(switchMap(value => {
        this.loading = true
        return this.$store.dispatch('fetchSystems', {
          page: this.page,
          minimal: true,
          beginsWith: value.newValue
        })
      }))
      .subscribe(systemsPaginated => {
        this.setSystems(systemsPaginated.docs)
        this.totalSystems = systemsPaginated.total
        this.loading = false
      })
  },
  methods: {
    ...mapMutations([
      'setSystems'
    ]),
    async fetchSystems () {
      this.loading = true
      let systemsPaginated = await this.$store.dispatch('fetchSystems', {
        page: this.page,
        minimal: true,
        beginsWith: this.systemName
      })
      this.setSystems(systemsPaginated.docs)
      this.totalSystems = systemsPaginated.total
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
