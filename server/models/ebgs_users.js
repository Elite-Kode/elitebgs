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
    let connection = db.elite_bgs;
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let user = new Schema({
        id: String,
        username: String,
        email: String,
        avatar: String,
        discriminator: String,
        access: Number,
        guilds: [{
            _id: false,
            id: String,
            name: String,
            icon: String
        }],
        factions: [{
            _id: false,
            name: String,
            name_lower: String
        }],
        systems: [{
            _id: false,
            name: String,
            name_lower: String
        }],
        editable_factions: [{
            _id: false,
            name: String,
            name_lower: String
        }]
    });

    let model = connection.model('ebgsUsers', user);

    resolve(model);
})
