/*
 * KodeBlox Copyright 2021 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http: //www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

import * as bugsnag from '@bugsnag/js'
import * as bugsnagExpress from '@bugsnag/plugin-express'
import * as processVars from './processVars'
import * as secrets from './secrets'

const useBugsnag = secrets.bugsnag_use

let bugsnagClient = {}

if (useBugsnag) {
  bugsnagClient = bugsnag.start({
    apiKey: require('./secrets').bugsnag_token,
    enabledReleaseStages: ['development', 'production'],
    plugins: [bugsnagExpress],
    appVersion: processVars.version
  })
}

function bugsnagCaller(err, metaData, logToConsole = true) {
  if (useBugsnag) {
    bugsnagClient.notify(err, (event) => {
      event.addMetadata('Custom', metaData)
    })
  }
  if (logToConsole) {
    console.log(err)
  }
}

let bugsnagWrapper = {
  bugsnagCaller,
  bugsnagClient
}

export { bugsnagCaller, bugsnagClient, bugsnagWrapper }

