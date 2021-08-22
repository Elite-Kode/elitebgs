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

import { model, Model, Schema, Document } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import * as mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

export interface IFactionV5Schema extends Document {
  eddb_id: number
  name: string
  name_lower: string
  updated_at: Date
  government: string
  allegiance: string
  home_system_name: string // Not in Journal
  is_player_faction: boolean // Not in Journal
  faction_presence: [
    {
      _id: boolean
      system_name: string
      system_name_lower: string
      system_id: Schema.Types.ObjectId
      state: string
      influence: number
      happiness: string
      active_states: [
        {
          _id: false
          state: string
        }
      ]
      pending_states: [
        {
          _id: false
          state: string
          trend: number
        }
      ]
      recovering_states: [
        {
          _id: false
          state: string
          trend: number
        }
      ]
      conflicts: [
        {
          _id: boolean
          type: string
          status: string
          opponent_name: string
          opponent_name_lower: string
          opponent_faction_id: Schema.Types.ObjectId
          station_id: Schema.Types.ObjectId
          stake: string
          stake_lower: string
          days_won: number
        }
      ]
      updated_at: Date
    }
  ]
}

const ebgsFaction: Schema = new Schema({
  eddb_id: { type: Number, index: true },
  name: String,
  name_lower: { type: String, lowercase: true, index: true },
  updated_at: { type: Date, index: true },
  government: { type: String, lowercase: true, index: true },
  allegiance: { type: String, lowercase: true, index: true },
  home_system_name: { type: String, lowercase: true }, // Not in Journal
  is_player_faction: Boolean, // Not in Journal
  faction_presence: [
    {
      _id: false,
      system_name: String,
      system_name_lower: { type: String, lowercase: true },
      system_id: { type: Schema.Types.ObjectId, index: true },
      state: { type: String, lowercase: true },
      influence: Number,
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
          opponent_faction_id: { type: Schema.Types.ObjectId, index: true },
          station_id: { type: Schema.Types.ObjectId, index: true },
          stake: String,
          stake_lower: { type: String, lowercase: true },
          days_won: Number
        }
      ],
      updated_at: { type: Date, index: true }
    }
  ]
})

ebgsFaction.plugin(mongoosePaginate)
ebgsFaction.plugin(mongooseAggregatePaginate)

export const FactionModel: Model<IFactionV5Schema> = model<IFactionV5Schema>('ebgsFactionV5', ebgsFaction)

export default model<IFactionV5Schema>('ebgsFactionV5', ebgsFaction)
