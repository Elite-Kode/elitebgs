/*
 * KodeBlox Copyright 2017 Sayak Mukhopadhyay
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

let mongoosePaginate = require('mongoose-paginate');

module.exports = (async () => {
    let db = require('../db');
    let connection = db.elite_bgs;
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;
    let ObjectId = mongoose.Schema.Types.ObjectId;

    let ebgsHistoryFaction = new Schema({
        faction_id: { type: ObjectId, index: true },
        faction_name: String,
        faction_name_lower: { type: String, lowercase: true },
        updated_at: { type: Date, index: true },
        updated_by: String,
        system: String,
        system_lower: { type: String, lowercase: true },
        system_id: { type: ObjectId, index: true },
        state: { type: String, lowercase: true },
        influence: Number,
        happiness: { type: String, lowercase: true },
        active_states: [{
            _id: false,
            state: { type: String, lowercase: true }
        }],
        pending_states: [{
            _id: false,
            state: { type: String, lowercase: true },
            trend: Number
        }],
        recovering_states: [{
            _id: false,
            state: { type: String, lowercase: true },
            trend: Number
        }],
        conflicts: [{
            _id: false,
            type: { type: String, lowercase: true },
            status: { type: String, lowercase: true },
            opponent_name: String,
            opponent_name_lower: { type: String, lowercase: true },
            opponent_faction_id: { type: ObjectId, index: true },
            station_id: { type: ObjectId, index: true },
            stake: String,
            stake_lower: { type: String, lowercase: true },
            days_won: Number
        }],
        systems: [{
            _id: false,
            system_id: { type: ObjectId, index: true },
            name: String,
            name_lower: { type: String, lowercase: true }
        }]
    }, { runSettersOnQuery: true });

    ebgsHistoryFaction.plugin(mongoosePaginate);

    let model = connection.model('ebgsHistoryFactionV5', ebgsHistoryFaction);

    return model;
})();
