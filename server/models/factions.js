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
        id: {
            type: Number,
            unique: true
        },
        name: String,
        updated_at: Date,
        government_id: Number,
        government: String,
        allegiance_id: Number,
        allegiance: String,
        state_id: Number,
        state: String,
        home_system_id: Number,
        is_player_faction: Boolean
    });

    faction.pre('save', function (next) {
        this.updated_at *= 1000;
        next();
    });

    faction.pre('findOneAndUpdate', function (next) {
        this._update.updated_at *= 1000;
        next();
    });

    let model = mongoose.model('faction', faction);

    resolve(model);
})