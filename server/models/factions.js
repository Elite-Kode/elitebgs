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

module.exports = new Promise((resolve, reject) => {
    let db = require('../db');
    let connection = db.eddb_api;
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let faction = new Schema({
        id: { type: Number, unique: true, index: true },
        name: String,
        name_lower: { type: String, lowercase: true, index: true },
        updated_at: Date,
        government_id: Number,
        government: { type: String, lowercase: true, index: true },
        allegiance_id: Number,
        allegiance: { type: String, lowercase: true, index: true },
        state_id: Number,
        state: { type: String, lowercase: true, index: true },
        home_system_id: Number,
        is_player_faction: { type: Boolean, index: true }
    }, { runSettersOnQuery: true });

    faction.pre('save', function (next) {
        lowerify(this);
        millisecondify(this);
        next();
    });

    faction.pre('findOneAndUpdate', function (next) {
        lowerify(this._update);
        millisecondify(this._update);
        next();
    });

    faction.plugin(mongoosePaginate);

    let model = connection.model('faction', faction);

    let lowerify = ref => {
        ref.name_lower = ref.name;
    }

    let millisecondify = ref => {
        ref.updated_at *= 1000;
    }

    resolve(model);
})
