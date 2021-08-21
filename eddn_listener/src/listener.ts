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

import * as zlib from 'zlib'
import * as zmq from 'zeromq'
import * as axios from 'axios'

import * as schemas from './schemas'
import * as bugsnag from './bugsnag'

const bugsnagCaller = bugsnag.bugsnagCaller

const sock = zmq.socket('sub')

let timer = Date.now()

const connectToEDDN = () => {
  sock.connect('tcp://eddn.edcd.io:9500')
  console.log('Connected to EDDN relay at port 9500')

  sock.subscribe('')
  console.log('Subscribed to EDDN')
}

connectToEDDN()

sock.on('message', (topic) => {
  timer = Date.now()
  const message = JSON.parse(zlib.inflateSync(topic).toString())
  const journalV5 = new schemas.journalV5()

  switch (message['$schemaRef']) {
    case journalV5.schemaId[0]:
    case journalV5.schemaId[1]:
      journalV5.trackSystem(message.message, message.header)
      break

    default:
      console.log('Schema not Found' + message['$schemaRef'])
  }
})

setInterval(async () => {
  if (Date.now() - timer > 300000) {
    try {
      const response = await axios.default.get('https://hosting.zaonce.net/launcher-status/status.json')
      if (response.status === 200) {
        const responseObject = JSON.parse(response.data)
        if (responseObject.status === 2) {
          bugsnagCaller(new Error('No message received from EDDN for more than 5 minutes'))
          connectToEDDN()
        }
      }
    } catch (err) {
      // Do nothing
    }

    timer = Date.now()
  }
}, 10000)
