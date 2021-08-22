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

import * as mongoose from 'mongoose'

import * as bugsnag from './bugsnag'
import * as secrets from './secrets'

const bugsnagCaller = bugsnag.bugsnagCaller

const elite_bgs_url = secrets.elite_bgs_db_url

const options = {
  keepAlive: true,
  keepAliveInitialDelay: 120000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: secrets.elite_bgs_db_user,
  pass: secrets.elite_bgs_db_pwd
}

mongoose.connect(elite_bgs_url, options, (err) => {
  if (err) {
    bugsnagCaller(err)
    console.log(err)
  }
})

mongoose.connection.on('connected', () => {
  console.log(`Connected to ${elite_bgs_url}`)
})

mongoose.connection.on('error', (err) => {
  bugsnagCaller(err)
  console.log(`Mongoose error ${err}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log(`Connection to ${elite_bgs_url} closed via app termination`)
  process.exit(0)
})
