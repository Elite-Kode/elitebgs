import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.deepOrange.base,
        secondary: colors.lightBlue.base,
        accent: colors.orange.base,
        error: colors.red.base,
        warning: colors.yellow.base,
        info: colors.indigo.base,
        success: colors.green.base,
        toolbar: colors.deepOrange.base
      },
      dark: {
        primary: colors.deepOrange.base,
        secondary: colors.lightBlue.base,
        accent: colors.orange.base,
        error: colors.red.base,
        warning: colors.yellow.base,
        info: colors.indigo.base,
        success: colors.green.base,
        toolbar: colors.grey.darken4
      }
    },
    options: {
      customProperties: true
    }
  }
})
