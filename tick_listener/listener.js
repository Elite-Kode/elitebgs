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
const io = require('socket.io-client')
const _ = require('lodash')
const tickTimesV5Model = require('./models/tick_times_v5')

const socket = io('https://tick.edcd.io/')

socket.on('connect', () => {
  console.log('Connected to Tick Detector')
})

socket.on('connect_error', (error) => {
  console.log('Connection Error', error)
})

socket.on('message', (data) => {
  let tickTime = new Date(data)
  saveTick(tickTime)
})

let saveTick = async (tickTime) => {
  try {
    let existingTicks = await tickTimesV5Model
      .find({
        time: {
          $gte: tickTime
        }
      })
      .lean()
    if (_.isEmpty(existingTicks)) {
      let document = new tickTimesV5Model({
        time: tickTime,
        updated_at: new Date(Date.now())
      })
      document.save()
    }
  } catch (err) {
    console.log(err)
  }
}
