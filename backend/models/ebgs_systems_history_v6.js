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
const mongoosePaginate = require('mongoose-paginate')
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')

let ObjectId = mongoose.Schema.Types.ObjectId

let ebgsSystemHistory = new mongoose.Schema(
  {
    record_id: { type: ObjectId, index: true },
    system_address: { type: String, index: true },
    name: String,
    name_lower: { type: String, lowercase: true, index: true },
    eddb_id: { type: Number, index: true },
    edsm_id: { type: Number, index: true },
    inara_id: { type: Number, index: true },
    x: Number,
    y: Number,
    z: Number,
    population: Number,
    government: { type: String, lowercase: true, index: true },
    allegiance: { type: String, lowercase: true, index: true },
    state: { type: String, lowercase: true, index: true },
    security: { type: String, lowercase: true, index: true },
    primary_economy: { type: String, lowercase: true, index: true },
    secondary_economy: { type: String, lowercase: true, index: true },
    controlling_faction_id: { type: ObjectId, index: true },
    updated_at: { type: Date, index: true }
  },
  { runSettersOnQuery: true }
)

ebgsSystemHistory.plugin(mongoosePaginate)
ebgsSystemHistory.plugin(mongooseAggregatePaginate)

module.exports = mongoose.model('ebgsSystemHistoryV6', ebgsSystemHistory)
