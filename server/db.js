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
mongoose.Promise = global.Promise;

let user = process.env.db_uname || require('../secrets.js').db_user;
let pass = process.env.db_pass || require('../secrets.js').db_pwd;

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

mongoose.connection.on('connected', () => {
    console.log(`Connected to ${url}`);
});

mongoose.connection.on('error', err => {
    console.log(`Mongoose error ${err}`);
});

(function () {
    let tracker = 0;
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection disconnected');
        if (tracker < 5) {
            console.log('Mongoose disconnected. Reconnecting in 5 seconds');
            tracker++;

            setTimeout(() => {
                tracker--;
            }, 60000);

            setTimeout(() => {
                connect();
            }, 5000);
        }
    })
})

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Connection closed via app termination');
        process.exit(0);
    });
});

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