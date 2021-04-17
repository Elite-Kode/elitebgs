<template>
  <v-dialog
    v-model="dialogState"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar light color="accent">
        <v-btn
          class="ml-0"
          icon
          light
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Try API</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn tile color="success" @click="addParameter">
            <v-icon>
              add
            </v-icon>
          </v-btn>
          <v-btn tile color="error" @click="reset">
            <v-icon>
              refresh
            </v-icon>
          </v-btn>
          <v-btn tile color="success" @click="go">
            <v-icon>
              arrow_forward
            </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-title>{{ method.toUpperCase() }} - {{ tryApiUrl }}</v-card-title>
      <v-card-text>
        <v-form>
          <div v-for="(parameter, index) in parametersSelected" :key="parameter+index" class="d-flex my-2 align-center">
            <v-row>
              <v-col cols="12" sm="12" md="4">
                <v-autocomplete
                  @input="parameterSelectChanged($event, index)"
                  :value="parameter"
                  :items="parameters"
                  item-text="name"
                  label="Parameter"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="8">
                <v-text-field
                  label="Value"
                  @input="parameterValueChanged($event, index)"
                  :value="parameterSelectedValues[index]"></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="error" class="ml-4" @click="deleteParameter(index)">
              <v-icon>
                delete
              </v-icon>
            </v-btn>
          </div>
        </v-form>
        <pre><code>{{ tryApiResponse }}</code></pre>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { debounceTime, switchMap } from 'rxjs/operators'

export default {
  name: 'SwaggerTryApi',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    path: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogState: this.value,
      parametersSelected: [],
      parameterSelectedValues: []
    }
  },
  computed: {
    ...mapState({
      selectedSpecDoc: state => state.tryApi.specDoc
    }),
    tryApiUrl () {
      let url = this.selectedSpecDoc.schemes + '://' + this.selectedSpecDoc.host + this.selectedSpecDoc.basePath + this.path
      if (this.parametersSelected.length > 0) {
        url += '?'
        for (let index = 0; index < this.parametersSelected.length; index++) {
          if (index > 0) {
            url += '&'
          }
          url += this.parametersSelected[index] + '=' + encodeURIComponent(this.parameterSelectedValues[index])
        }
      }
      return url
    },
    parameters () {
      return this.selectedSpecDoc.paths[this.path][this.method].parameters
    }
  },
  watch: {
    dialogState () {
      this.$emit('input', this.dialogState)
    },
    value () {
      this.dialogState = this.value
    }
  },
  methods: {
    closeDialog () {
      this.reset()
      this.dialogState = false
    },
    addParameter () {
      this.parametersSelected.push('')
      this.parameterSelectedValues.push('')
    },
    deleteParameter (index) {
      this.parametersSelected.splice(index, 1)
      this.parameterSelectedValues.splice(index, 1)
    },
    parameterSelectChanged (event, index) {
      this.parametersSelected.splice(index, 1, event)
    },
    parameterValueChanged (event, index) {
      this.parameterSelectedValues.splice(index, 1, event)
    },
    reset () {
      this.parametersSelected = []
      this.parameterSelectedValues = []
      this.tryApiResponse = null
    }
  },
  observableMethods: {
    go: 'go$'
  },
  subscriptions () {
    return {
      tryApiResponse: this.go$
        .pipe(debounceTime(300))
        .pipe(switchMap(() => {
          return this.$store.dispatch('fetchFromApiUrl', {
            url: this.tryApiUrl,
            method: this.method
          })
        }))
    }
  }
}
</script>

<style scoped>

</style>
