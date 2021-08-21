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
import { Schema, Document } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'

export interface IFactionSchema extends Document {
  eddb_id: number
  name: string
  name_lower: string
  updated_at: Date
  government: string
  allegiance: string
  home_system_name: string
  is_player_faction: boolean
  faction_presence: [
    {
      _id: boolean
      system_name: string
      system_name_lower: string
    }
  ]
  history: [
    {
      _id: boolean
      updated_at: Date
      system: string
      system_lower: string
      state: string
      influence: number
      pending_states: [
        {
          _id: boolean
          state: string
          trend: number
        }
      ]
      recovering_states: [
        {
          _id: boolean
          state: string
          trend: number
        }
      ]
    }
  ]
}

const ebgsFaction: Schema = new mongoose.Schema({
  eddb_id: Number,
  name: String,
  name_lower: { type: String, lowercase: true, index: true },
  updated_at: Date,
  government: { type: String, lowercase: true, index: true },
  allegiance: { type: String, lowercase: true, index: true },
  home_system_name: { type: String, lowercase: true },
  is_player_faction: Boolean,
  faction_presence: [
    {
      _id: false,
      system_name: String,
      system_name_lower: { type: String, lowercase: true }
    }
  ],
  history: [
    {
      _id: false,
      updated_at: Date,
      system: String,
      system_lower: { type: String, lowercase: true },
      state: { type: String, lowercase: true },
      influence: Number,
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
      ]
    }
  ]
})

ebgsFaction.plugin(mongoosePaginate)

export default mongoose.model<IFactionSchema>('ebgsFaction', ebgsFaction)
