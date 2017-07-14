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

module.exports = new Promise((resolve, reject) => {
    let db = require('../db');
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let ebgsFactionHistory = new Schema({
        eddb_id: Number,
        name: String,
        name_lower: { type: String, lowercase: true },
        updated_at: Date,
        history: [{
            _id: false,
            updated_at: Date,
            system: String,
            system_lower: { type: String, lowercase: true },
            state: { type: String, lowercase: true },
            influence: Number,
            pending_states: [{
                state: { type: String, lowercase: true },
                trend: Number
            }],
            recovering_states: [{
                state: { type: String, lowercase: true },
                trend: Number
            }]
        }]
    }, { runSettersOnQuery: true });

    let model = mongoose.model('ebgsFactionHistory', ebgsFactionHistory);

    resolve(model);
})
