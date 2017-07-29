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

    let station = new Schema({
        id: { type: Number, unique: true, index: true },
        name: String,
        name_lower: { type: String, lowercase: true, index: true },
        system_id: { type: Number, ref: 'system.id' },
        updated_at: Date,
        max_landing_pad_size: { type: String, lowercase: true, index: true },
        distance_to_star: { type: Number, index: true },
        government_id: Number,
        government: { type: String, lowercase: true, index: true },
        allegiance_id: Number,
        allegiance: { type: String, lowercase: true, index: true },
        state_id: Number,
        state: { type: String, lowercase: true },
        type_id: Number,
        type: { type: String, lowercase: true },
        has_blackmarket: { type: Boolean, index: true },
        has_market: { type: Boolean, index: true },
        has_refuel: { type: Boolean, index: true },
        has_repair: { type: Boolean, index: true },
        has_rearm: { type: Boolean, index: true },
        has_outfitting: { type: Boolean, index: true },
        has_shipyard: { type: Boolean, index: true },
        has_docking: Boolean,
        has_commodities: Boolean,
        import_commodities: [{
            name: String,
            name_lower: { type: String, lowercase: true }
        }],
        export_commodities: [{
            name: String,
            name_lower: { type: String, lowercase: true }
        }],
        prohibited_commodities: [{
            name: String,
            name_lower: { type: String, lowercase: true }
        }],
        economies: [{
            name: String,
            name_lower: { type: String, lowercase: true }
        }],
        shipyard_updated_at: Date,
        outfitting_updated_at: Date,
        market_updated_at: Date,
        is_planetary: { type: Boolean, index: true },
        selling_ships: [{
            name: String,
            name_lower: { type: String, lowercase: true }
        }],
        selling_modules: [Number],
        settlement_size_id: Number,
        settlement_size: { type: String, lowercase: true },
        settlement_security_id: Number,
        settlement_security: { type: String, lowercase: true },
        body_id: { type: Number, ref: 'body.id' },
        controlling_minor_faction_id: { type: Number, ref: 'faction.id' }
    }, { runSettersOnQuery: true });

    station.pre('save', function (next) {
        lowerify(this);
        millisecondify(this);
        next();
    });

    station.pre('findOneAndUpdate', function (next) {
        lowerify(this._update);
        millisecondify(this._update);
        next();
    });

    station.plugin(mongoosePaginate);

    let model = connection.model('station', station);

    let lowerify = ref => {
        ref.name_lower = ref.name;
    }

    let millisecondify = ref => {
        ref.updated_at *= 1000;
        if (ref.shipyard_updated_at) {
            ref.shipyard_updated_at *= 1000;
        }
        if (ref.outfitting_updated_at) {
            ref.outfitting_updated_at *= 1000;
        }
        if (ref.market_updated_at) {
            ref.market_updated_at *= 1000;
        }
    }

    resolve(model);
})
