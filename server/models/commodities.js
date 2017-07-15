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
    let connection = db.eddb_api;
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let commodity = new Schema({
        id: { type: Number, unique: true },
        station_id: { type: Number, ref: 'station.id' },
        commodity_id: Number,
        supply: Number,
        buy_price: Number,
        sell_price: Number,
        demand: Number,
        collected_at: Date
    }, { runSettersOnQuery: true });

    commodity.pre('save', function (next) {
        millisecondify(this);
        next();
    });

    commodity.pre('findOneAndUpdate', function (next) {
        millisecondify(this._update);
        next();
    });

    let model = connection.model('commodity', commodity);

    let millisecondify = ref => {
        ref.collected_at *= 1000;
    }

    resolve(model);
})
