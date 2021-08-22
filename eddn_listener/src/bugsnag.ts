/*
 * Copyright 2021 Elite Kode development team, Kode Blox, and Sayak Mukhopadhyay
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

import Bugsnag, { Client, NotifiableError } from '@bugsnag/js'
import BugsnagPluginExpress from '@bugsnag/plugin-express'

import { version } from './processVars'
import * as secrets from './secrets'

const useBugsnag = secrets.bugsnag_use
const bugsnagToken = secrets.bugsnag_token

let bugsnagClient: Client

if (useBugsnag) {
  bugsnagClient = Bugsnag.start({
    apiKey: bugsnagToken,
    enabledReleaseStages: ['development', 'production'],
    plugins: [BugsnagPluginExpress],
    appVersion: version.default.version
  })
}

function bugsnagCaller(err: NotifiableError, metaData?: unknown, logToConsole = true): void {
  if (useBugsnag) {
    bugsnagClient.notify(err, (event) => {
      event.addMetadata('Custom', metaData)
    })
  }
  if (logToConsole) {
    console.log(err)
  }
}

const bugsnagWrapper = {
  bugsnagCaller,
  bugsnagClient
}

export { bugsnagWrapper, bugsnagClient, bugsnagCaller }
