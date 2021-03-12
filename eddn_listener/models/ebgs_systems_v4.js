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

let ebgsSystem = new mongoose.Schema({
    eddb_id: { type: Number, index: true },
    name: String,
    name_lower: { type: String, lowercase: true, index: true },
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
    needs_permit: Boolean,      // Not in Journal
    reserve_type: { type: String, lowercase: true },    // Not in Journal
    controlling_minor_faction: { type: String, lowercase: true, index: true },
    factions: [{
        _id: false,
        name: String,
        name_lower: { type: String, lowercase: true }
    }],
    conflicts: [{
        _id: false,
        type: { type: String, lowercase: true },
        status: { type: String, lowercase: true },
        faction1: {
            name: String,
            name_lower: { type: String, lowercase: true },
            stake: String,
            stake_lower: { type: String, lowercase: true },
            days_won: Number
        },
        faction2: {
            name: String,
            name_lower: { type: String, lowercase: true },
            stake: String,
            stake_lower: { type: String, lowercase: true },
            days_won: Number
        }
    }],
    updated_at: { type: Date, index: true }
}, { runSettersOnQuery: true });

ebgsSystem.plugin(mongoosePaginate);

module.exports = mongoose.model('ebgsSystemV4', ebgsSystem);
