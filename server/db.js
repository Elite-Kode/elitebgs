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

let mongoose = require('mongoose');

let user = process.env.db_uname || "elite_bgs_readwrite";
let pass = process.env.db_pass || "damndifficultpassword";

let url = process.env.dbURL || "mongodb://localhost:27017/elite_bgs";

let options = {
    server: {
        socketOptions: {
            keepAlive: 120
        }
    },
    user,
    pass
}

function connect() {
    mongoose.connect(url, options, (err, db) => {
        if (err) {
            return console.log(err);
        }
    });
}

connect();

module.exports.mongoose = mongoose;
module.exports.connect = connect;