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

export interface IConfig extends Document {
  guild_id: string
  admin_channel_id: string
  user_role_id: string
  blacklisted_software: [string]
  version_software: [
    {
      name: string
      version: string
    }
  ]
  whitelisted_software: [string]
  time_offset: number
}

const configSchema: Schema = new Schema({
  guild_id: String,
  admin_channel_id: String,
  user_role_id: String,
  blacklisted_software: [String],
  version_software: [
    {
      name: String,
      version: String
    }
  ],
  whitelisted_software: [String],
  time_offset: Number
})

export const ConfigModel: Model<IConfig> = model<IConfig>('configs', configSchema)

export default model<IConfig>('configs', configSchema)
