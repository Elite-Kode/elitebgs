import Vue from 'vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import vuePlugin from '@highlightjs/vue-plugin'

hljs.registerLanguage('json', json)

Vue.use(vuePlugin)
