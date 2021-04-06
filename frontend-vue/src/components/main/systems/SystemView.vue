<template>
  <!--  <h1>{{systemData?.name}}</h1>-->
  <h1>Name</h1>
</template>

<script>
export default {
  name: 'SystemView',
  data () {
    return {
      fromDateFilter: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      toDateFilter: new Date(Date.now()),
      loading: false
    }
  },
  props: {
    systemId: {
      type: String,
      default: ''
    }
  },
  async created () {
    await this.checkRedirect()
  },
  methods: {
    async checkRedirect () {
      if (this.systemId.toLowerCase().startsWith('eddbid-')) {
        let system = await this.$store.dispatch('fetchSystemByEddbId', {
          eddbId: this.systemId.slice(7)
        })
        this.$router.push({ name: 'system-detail', params: { systemId: system.docs[0]._id } })
      }
    },
    async fetchSystemWithHistoryById () {
      this.loading = true
      let systemsPaginated = await this.$store.dispatch('fetchSystemWithHistoryById', {
        id: this.systemId,
        timeMin: this.fromDateFilter,
        timeMax: this.toDateFilter
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
