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

    let populatedSystem = new Schema({
        id: {
            type: Number,
            unique: true
        },
        edsm_id: Number,
        name: String,
        x: Number,
        y: Number,
        z: Number,
        population: Number,
        is_populated: Boolean,
        government_id: Number,
        government: String,
        allegiance_id: Number,
        allegiance: String,
        state_id: Number,
        state: String,
        security_id: Number,
        security: String,
        primary_economy_id: Number,
        primary_economy: String,
        power: String,
        power_state: String,
        power_state_id: Number,
        needs_permit: Boolean,
        updated_at: Date,
        simbad_ref: String,
        controlling_minor_faction_id: {
            type: Number,
            ref: 'faction.id'
        },
        controlling_minor_faction: {
            type: String,
            ref: 'faction.name'
        },
        reserve_type_id: Number,
        reserve_type: String,
        minor_faction_presences: [{
            name: String,
            government: String,
            state: String,
            influence: Number,
            allegiance: String
        }]
    });

    populatedSystem.pre('save', function (next) {
        this.updated_at *= 1000;
        next();
    });

    populatedSystem.pre('findOneAndUpdate', function (next) {
        this._update.updated_at *= 1000;
        next();
    });

    let model = mongoose.model('populatedSystem', populatedSystem);

    resolve(model);
})