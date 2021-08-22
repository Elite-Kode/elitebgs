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

export interface ISystemV5Schema extends Document {
  eddb_id: number
  name: string
  name_lower: string
  name_aliases: [
    {
      _id: boolean
      name: string
      name_lower: string
    }
  ]
  x: number
  y: number
  z: number
  system_address: string
  population: number
  government: string
  allegiance: string
  state: string
  security: string
  primary_economy: string
  secondary_economy: string
  needs_permit: boolean // Not in Journal
  reserve_type: string // Not in Journal
  controlling_minor_faction_cased: string
  controlling_minor_faction: string
  controlling_minor_faction_id: Schema.Types.ObjectId
  factions: [
    {
      _id: false
      faction_id: Schema.Types.ObjectId
      name: string
      name_lower: string
    }
  ]
  conflicts: [
    {
      _id: false
      type: string
      status: string
      faction1: {
        faction_id: Schema.Types.ObjectId
        name: string
        name_lower: string
        station_id: Schema.Types.ObjectId
        stake: string
        stake_lower: string
        days_won: number
      }
      faction2: {
        faction_id: Schema.Types.ObjectId
        name: string
        name_lower: string
        station_id: Schema.Types.ObjectId
        stake: string
        stake_lower: string
        days_won: number
      }
    }
  ]
  updated_at: Date
}

const ebgsSystem: Schema = new Schema({
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
  needs_permit: Boolean, // Not in Journal
  reserve_type: { type: String, lowercase: true }, // Not in Journal
  controlling_minor_faction_cased: String,
  controlling_minor_faction: { type: String, lowercase: true, index: true },
  controlling_minor_faction_id: { type: Schema.Types.ObjectId, index: true },
  factions: [
    {
      _id: false,
      faction_id: { type: Schema.Types.ObjectId, index: true },
      name: String,
      name_lower: { type: String, lowercase: true }
    }
  ],
  conflicts: [
    {
      _id: false,
      type: { type: String, lowercase: true },
      status: { type: String, lowercase: true },
      faction1: {
        faction_id: { type: Schema.Types.ObjectId, index: true },
        name: String,
        name_lower: { type: String, lowercase: true },
        station_id: { type: Schema.Types.ObjectId, index: true },
        stake: String,
        stake_lower: { type: String, lowercase: true },
        days_won: Number
      },
      faction2: {
        faction_id: { type: Schema.Types.ObjectId, index: true },
        name: String,
        name_lower: { type: String, lowercase: true },
        station_id: { type: Schema.Types.ObjectId, index: true },
        stake: String,
        stake_lower: { type: String, lowercase: true },
        days_won: Number
      }
    }
  ],
  updated_at: { type: Date, index: true }
})

ebgsSystem.plugin(mongoosePaginate)
ebgsSystem.plugin(mongooseAggregatePaginate)

export const SystemModel: Model<ISystemV5Schema> = model<ISystemV5Schema>('ebgsSystemV5', ebgsSystem)
export default model<ISystemV5Schema>('ebgsSystemV5', ebgsSystem)
