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

let ebgsHistorySystem = new mongoose.Schema({
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
    factions: [{
        _id: false,
        faction_id: { type: ObjectId, index: true },
        name: String,
        name_lower: { type: String, lowercase: true }
    }],
    conflicts: [{
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
    }]
}, { runSettersOnQuery: true });

ebgsHistorySystem.plugin(mongoosePaginate);

module.exports = mongoose.model('ebgsHistorySystemV5', ebgsHistorySystem);
