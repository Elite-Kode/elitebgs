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

export interface IStationV5Schema extends Document {
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
  market_id: string
  type: string
  system: string
  system_lower: string
  system_id: Schema.Types.ObjectId
  updated_at: Date
  government: string
  economy: string
  all_economies: [
    {
      _id: boolean
      name: string
      proportion: number
    }
  ]
  allegiance: string
  state: string
  distance_from_star: number
  controlling_minor_faction_cased: string
  controlling_minor_faction: string
  controlling_minor_faction_id: Schema.Types.ObjectId
  services: [
    {
      _id: boolean
      name: string
      name_lower: string
    }
  ]
}

const ebgsStation: Schema = new Schema({
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
  market_id: { type: String, index: true },
  type: { type: String, lowercase: true, index: true },
  system: String,
  system_lower: { type: String, lowercase: true, index: true },
  system_id: { type: Schema.Types.ObjectId, index: true },
  updated_at: { type: Date, index: true },
  government: { type: String, lowercase: true, index: true },
  economy: { type: String, lowercase: true, index: true },
  all_economies: [
    {
      _id: false,
      name: { type: String, lowercase: true },
      proportion: Number
    }
  ],
  allegiance: { type: String, lowercase: true, index: true },
  state: { type: String, lowercase: true, index: true },
  distance_from_star: Number,
  controlling_minor_faction_cased: String,
  controlling_minor_faction: { type: String, lowercase: true, index: true },
  controlling_minor_faction_id: { type: Schema.Types.ObjectId, index: true },
  services: [
    {
      _id: false,
      name: String,
      name_lower: { type: String, lowercase: true }
    }
  ]
})

ebgsStation.plugin(mongoosePaginate)
ebgsStation.plugin(mongooseAggregatePaginate)

export const StationModel: Model<IStationV5Schema> = model<IStationV5Schema>('ebgsStationV5', ebgsStation)
export default model<IStationV5Schema>('ebgsStationV5', ebgsStation)
