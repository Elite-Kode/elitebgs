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

const mongoose = require('mongoose')
const clustering = require('density-clustering')
const moment = require('moment')
const io = require('socket.io')
const tickDetector = require('./models/tick_detector')
const tickTimesV5Model = require('./models/tick_times_v5')

const socket = new io.Server(31173, { pingTimeout: 30000, allowEIO3: true })

socket.on('connection', function () {
  // Todo: do something on connection
  console.log(`New connection`)
})

module.exports = async function (socket, freshness, threshold, delta) {
  let mongoSession = await mongoose.startSession()
  await mongoSession.withTransaction(async () => {
    let start = moment().subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ssZ')
    let lastTick = tickTimesV5Model.find({}).sort({ time: -1 }).limit(1).lean()[0]
    if (lastTick) {
      start = moment(lastTick).toDate()
    }

    const data = await tickDetector
      .find({
        $and: [
          { delta: { $exists: true } },
          { delta: { $lte: freshness } },
          { first_seen: { $gte: start } },
          { influence: { $gt: 0 } }
        ]
      })
      .distinct('system')
      .sort({ first_seen: -1 })
      .lean()
      .map((element) => [moment(element.first_seen).format('X')])

    let dbscan = new clustering.DBSCAN()
    let clusters = dbscan.run(data, delta, threshold)

    for (let i in clusters) {
      let sorted = clusters[i].map((x) => data[x]).sort()
      let size = sorted.length
      let start = new moment(sorted[0], 'X')
      let detected = new moment(sorted[threshold - 1], 'X')
      if (i >= 1) {
        console.log(
          `Tick - ${start.format('YYYY-MM-DD HH:mm:ss')} - ${detected.format('YYYY-MM-DD HH:mm:ss')} - ${size} items`
        )
        socket.emit('tick', start.format('YYYY-MM-DDTHH:mm:ssZ'))
      }
    }
  })
  mongoSession.endSession()
}
