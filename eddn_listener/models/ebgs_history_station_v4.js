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

"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

let ObjectId = mongoose.Schema.Types.ObjectId;

let ebgsHistoryStation = new mongoose.Schema({
    station_id: { type: ObjectId, index: true },
    station_name_lower: { type: String, lowercase: true },
    updated_at: { type: Date, index: true },
    updated_by: String,
    government: { type: String, lowercase: true },
    allegiance: { type: String, lowercase: true },
    state: { type: String, lowercase: true },
    controlling_minor_faction: { type: String, lowercase: true },
    services: [{
        _id: false,
        name: String,
        name_lower: { type: String, lowercase: true }
    }]
}, { runSettersOnQuery: true });

ebgsHistoryStation.plugin(mongoosePaginate);

module.exports = mongoose.model('ebgsHistoryStationV4', ebgsHistoryStation);
