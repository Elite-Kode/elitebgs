<template>
    <div>
        <h1>Profile Data</h1>
        <v-form>
            <v-row align="center">
                <v-col cols="3">
                    <v-subheader>Commander Name</v-subheader>
                </v-col>
                <v-col cols="9">
                    <v-text-field
                        :value="authUser.commander"
                        dense
                        readonly>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row align="center">
                <v-col cols="3">
                    <v-subheader>ID</v-subheader>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        :value="authUser._id"
                        dense
                        readonly/>
                </v-col>
                <v-col cols="3">
                    <v-subheader>Frontier ID</v-subheader>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        :value="authUser.frontier_id"
                        dense
                        readonly/>
                </v-col>
            </v-row>
            <v-row align="center">
                <v-col cols="3">
                    <v-subheader>Access</v-subheader>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        :value="authUser.access"
                        dense
                        readonly/>
                </v-col>
                <v-col cols="3">
                    <v-subheader>Trusted</v-subheader>
                </v-col>
                <v-col cols="3">
                    <v-checkbox
                        v-model="authUser.trusted"
                        dense
                        readonly/>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Data',
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    })
  },
  created () {
    this.$store.dispatch('checkAuthenticated')
    this.$store.dispatch('fetchAuthUser')
  }
}
</script>
