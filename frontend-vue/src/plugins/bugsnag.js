import Vue from 'vue'
import bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import secrets from '../secrets'
import version from '../version'

if (secrets.bugsnag_use) {
  bugsnag.start({
    apiKey: secrets.bugsnag_token_vue,
    enabledReleaseStages: ['development', 'production'],
    collectUserIp: false,
    appVersion: version,
    plugins: [new BugsnagPluginVue(Vue)]
  })
}
