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

    let config = new Schema({
        guild_id: String,
        admin_channel_id: String,
        invite_channel_id: String,
        editor_role_id: String,
        guest_role_id: String,
        blacklisted_software: [String],
        version_software: [{
            name: String,
            version: String
        }],
        time_offset: Number
    });

    let model = connection.model('configs', config);

    resolve(model);
})
