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

let ebgsFaction = new mongoose.Schema({
    eddb_id: Number,
    name: String,
    name_lower: { type: String, lowercase: true, index: true },
    updated_at: Date,
    government: { type: String, lowercase: true, index: true },
    allegiance: { type: String, lowercase: true, index: true },
    home_system_name: { type: String, lowercase: true },
    is_player_faction: Boolean,
    faction_presence: [{
        _id: false,
        system_name: String,
        system_name_lower: { type: String, lowercase: true }
    }],
    history: [{
        _id: false,
        updated_at: Date,
        system: String,
        system_lower: { type: String, lowercase: true },
        state: { type: String, lowercase: true },
        influence: Number,
        pending_states: [{
            _id: false,
            state: { type: String, lowercase: true },
            trend: Number
        }],
        recovering_states: [{
            _id: false,
            state: { type: String, lowercase: true },
            trend: Number
        }]
    }]
}, { runSettersOnQuery: true });

ebgsFaction.plugin(mongoosePaginate);

module.exports = mongoose.model('ebgsFaction', ebgsFaction);
