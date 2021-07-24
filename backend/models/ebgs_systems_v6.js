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

let ebgsSystem = new mongoose.Schema(
  {
    eddb_id: { type: Number, index: true },
    name: String,
    name_lower: { type: String, lowercase: true, index: true },
    name_aliases: [
      {
        _id: false,
        name: String,
        name_lower: String
      }
    ],
    x: Number,
    y: Number,
    z: Number,
    system_address: { type: String, index: true },
    population: Number,
    government: { type: String, lowercase: true, index: true },
    allegiance: { type: String, lowercase: true, index: true },
    state: { type: String, lowercase: true, index: true },
    security: { type: String, lowercase: true, index: true },
    primary_economy: { type: String, lowercase: true, index: true },
    secondary_economy: { type: String, lowercase: true, index: true },
    controlling_faction_name: String,
    controlling_faction_name_lower: { type: String, lowercase: true, index: true },
    controlling_faction_id: { type: ObjectId, index: true },
    updated_at: { type: Date, index: true }
  },
  { runSettersOnQuery: true }
)

ebgsSystem.plugin(mongoosePaginate)
ebgsSystem.plugin(mongooseAggregatePaginate)

module.exports = mongoose.model('ebgsSystemV6', ebgsSystem)
