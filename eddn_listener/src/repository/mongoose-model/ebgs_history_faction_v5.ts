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
import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'

const ObjectId = mongoose.Schema.Types.ObjectId

const ebgsHistoryFaction = new mongoose.Schema(
  {
    faction_id: { type: ObjectId, index: true },
    faction_name: { type: String, index: true },
    faction_name_lower: { type: String, lowercase: true },
    updated_at: { type: Date, index: true },
    updated_by: String,
    delta: { type: Number, index: true },
    system: String,
    system_lower: { type: String, lowercase: true, index: true },
    system_id: { type: ObjectId, index: true },
    state: { type: String, lowercase: true },
    influence: { type: Number, index: true },
    happiness: { type: String, lowercase: true },
    active_states: [
      {
        _id: false,
        state: { type: String, lowercase: true }
      }
    ],
    pending_states: [
      {
        _id: false,
        state: { type: String, lowercase: true },
        trend: Number
      }
    ],
    recovering_states: [
      {
        _id: false,
        state: { type: String, lowercase: true },
        trend: Number
      }
    ],
    conflicts: [
      {
        _id: false,
        type: { type: String, lowercase: true },
        status: { type: String, lowercase: true },
        opponent_name: String,
        opponent_name_lower: { type: String, lowercase: true },
        opponent_faction_id: { type: ObjectId, index: true },
        station_id: { type: ObjectId, index: true },
        stake: String,
        stake_lower: { type: String, lowercase: true },
        days_won: Number
      }
    ],
    systems: [
      {
        _id: false,
        system_id: { type: ObjectId, index: true },
        name: String,
        name_lower: { type: String, lowercase: true }
      }
    ]
  },
  { runSettersOnQuery: true }
)

ebgsHistoryFaction.plugin(mongoosePaginate)

module.exports = mongoose.model('ebgsHistoryFactionV5', ebgsHistoryFaction)
