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
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

let ebgsSystem = new mongoose.Schema({
    eddb_id: Number,
    name: String,
    name_lower: { type: String, lowercase: true, index: true },
    x: Number,
    y: Number,
    z: Number,
    population: Number,
    government: { type: String, lowercase: true, index: true },
    allegiance: { type: String, lowercase: true, index: true },
    state: { type: String, lowercase: true, index: true },
    security: { type: String, lowercase: true, index: true },
    primary_economy: { type: String, lowercase: true, index: true },
    needs_permit: Boolean,      // Not in Journal
    reserve_type: { type: String, lowercase: true },    // Not in Journal
    controlling_minor_faction: { type: String, lowercase: true, index: true },
    factions: [{
        _id: false,
        name: String,
        name_lower: { type: String, lowercase: true }
    }],
    updated_at: Date,
    history: [{
        updated_at: Date,
        updated_by: String,
        population: Number,
        government: { type: String, lowercase: true },
        allegiance: { type: String, lowercase: true },
        state: { type: String, lowercase: true },
        security: { type: String, lowercase: true },
        controlling_minor_faction: { type: String, lowercase: true },
        factions: [{
            _id: false,
            name: String,
            name_lower: { type: String, lowercase: true }
        }]
    }]
}, { runSettersOnQuery: true });

ebgsSystem.plugin(mongoosePaginate);
ebgsSystem.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model('ebgsSystemV3', ebgsSystem);
