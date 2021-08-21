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

const ObjectId = mongoose.Schema.Types.ObjectId

export interface IHistorySystemV5Schema extends Document {
  system_id: mongoose.ObjectId
  system_name: string
  system_name_lower: string
  updated_at: Date
  updated_by: string
  population: number
  government: string
  allegiance: string
  state: string
  security: string
  controlling_minor_faction_cased: string
  controlling_minor_faction: string
  controlling_minor_faction_id: mongoose.ObjectId
  factions: [
    {
      _id: boolean
      faction_id: mongoose.ObjectId
      name: string
      name_lower: string
    }
  ]
  conflicts: [
    {
      _id: boolean
      type: string
      status: string
      faction1: {
        faction_id: mongoose.ObjectId
        name: string
        name_lower: string
        station_id: mongoose.ObjectId
        stake: string
        stake_lower: string
        days_won: number
      }
      faction2: {
        faction_id: mongoose.ObjectId
        name: string
        name_lower: string
        station_id: mongoose.ObjectId
        stake: string
        stake_lower: string
        days_won: number
      }
    }
  ]
}

const ebgsHistorySystem: Schema = new mongoose.Schema({
  system_id: { type: ObjectId, index: true },
  system_name: String,
  system_name_lower: { type: String, lowercase: true },
  updated_at: { type: Date, index: true },
  updated_by: String,
  population: Number,
  government: { type: String, lowercase: true },
  allegiance: { type: String, lowercase: true },
  state: { type: String, lowercase: true },
  security: { type: String, lowercase: true },
  controlling_minor_faction_cased: String,
  controlling_minor_faction: { type: String, lowercase: true },
  controlling_minor_faction_id: { type: ObjectId, index: true },
  factions: [
    {
      _id: false,
      faction_id: { type: ObjectId, index: true },
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
        faction_id: { type: ObjectId, index: true },
        name: String,
        name_lower: { type: String, lowercase: true },
        station_id: { type: ObjectId, index: true },
        stake: String,
        stake_lower: { type: String, lowercase: true },
        days_won: Number
      },
      faction2: {
        faction_id: { type: ObjectId, index: true },
        name: String,
        name_lower: { type: String, lowercase: true },
        station_id: { type: ObjectId, index: true },
        stake: String,
        stake_lower: { type: String, lowercase: true },
        days_won: Number
      }
    }
  ]
})

ebgsHistorySystem.plugin(mongoosePaginate)

export default mongoose.model<IHistorySystemV5Schema>('ebgsHistorySystemV5', ebgsHistorySystem)
