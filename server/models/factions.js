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

    let faction = new Schema({
        id: { type: Number, unique: true },
        name: String,
        name_lower: { type: String, lowercase: true },
        updated_at: Date,
        government_id: Number,
        government: { type: String, lowercase: true },
        allegiance_id: Number,
        allegiance: { type: String, lowercase: true },
        state_id: Number,
        state: { type: String, lowercase: true },
        home_system_id: Number,
        is_player_faction: Boolean
    }, { runSettersOnQuery: true });

    faction.pre('save', function (next) {
        // this.updated_at *= 1000;
        // this.name_lower = this.name;
        lowerify(this);
        millisecondify(this);
        next();
    });

    faction.pre('findOneAndUpdate', function (next) {
        // this._update.updated_at *= 1000;
        // this._update.name_lower = this._update.name;
        lowerify(this._update);
        millisecondify(this._update);
        next();
    });

    let model = mongoose.model('faction', faction);

    let lowerify = ref => {
        ref.name_lower = ref.name;
    }

    let millisecondify = ref => {
        ref.updated_at *= 1000;
    }

    resolve(model);
})