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

export interface IHistoryStationV5Schema extends Document {
  station_id: Schema.Types.ObjectId
  station_name: string
  station_name_lower: string
  updated_at: Date
  updated_by: string
  type: string
  government: string
  allegiance: string
  state: string
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

const ebgsHistoryStation: Schema = new Schema({
  station_id: { type: Schema.Types.ObjectId, index: true },
  station_name: String,
  station_name_lower: { type: String, lowercase: true },
  updated_at: { type: Date, index: true },
  updated_by: String,
  type: { type: String, lowercase: true, index: true },
  government: { type: String, lowercase: true },
  allegiance: { type: String, lowercase: true },
  state: { type: String, lowercase: true },
  controlling_minor_faction_cased: String,
  controlling_minor_faction: { type: String, lowercase: true },
  controlling_minor_faction_id: { type: Schema.Types.ObjectId, index: true },
  services: [
    {
      _id: false,
      name: String,
      name_lower: { type: String, lowercase: true }
    }
  ]
})

ebgsHistoryStation.plugin(mongoosePaginate)
export const HistoryStationModel: Model<IHistoryStationV5Schema> = model<IHistoryStationV5Schema>(
  'ebgsHistoryStationV5',
  ebgsHistoryStation
)
export default model<IHistoryStationV5Schema>('ebgsHistoryStationV5', ebgsHistoryStation)
