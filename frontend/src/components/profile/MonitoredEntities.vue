<template>
  <v-card>
    <v-card-title>
      Monitored {{ entityName }}
    </v-card-title>
    <v-card-text>
      <v-simple-table class="elevation-1" dense>
        <thead>
        <tr>
          <th>Monitored {{ entityName }}</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="entity of entities" :key="entity.id">
          <td>{{ entity.name }}</td>
          <td>
            <v-btn icon color="error" @click="onDelete(entity.id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MonitoredEntities',
  props: {
    entities: {
      type: Array,
      default () {
        return []
      }
    },
    entityName: {
      type: String,
      default: ''
    }
  },
  methods: {
    onDelete (id) {
      this.$emit('delete', id)
    }
  }
}
</script>

<style scoped>

</style>
