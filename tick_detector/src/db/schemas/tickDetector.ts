/*
 * Copyright 2021 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Document, model, ObjectId, Schema } from 'mongoose';

export interface TickDetector {
  faction_id: ObjectId;
  system_id: ObjectId;
  influence: number;
  first_seen: Date;
  last_seen: Date;
  count: number;
  delta: number;
}

export interface ITickDetectorSchema extends Document, TickDetector {}

export const TickDetectorSchema = new Schema<ITickDetectorSchema>({
  faction_id: { type: Schema.Types.ObjectId, index: true },
  system_id: { type: Schema.Types.ObjectId, index: true },
  influence: { type: Number, index: true },
  first_seen: Date,
  last_seen: Date,
  count: Number,
  delta: Number
});

export const TickDetectorModel = model('TickDetector', TickDetectorSchema, 'tickDetector');
