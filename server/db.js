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

const bugsnagCaller = require('./bugsnag').bugsnagCaller;
let elite_bgs_url = require('../secrets').elite_bgs_db_url;

let elite_bgs_connection;

function connect() {
    elite_bgs_connection = mongoose.createConnection(elite_bgs_url);
}

connect();

elite_bgs_connection.on('connected', () => {
    console.log(`Connected to ${elite_bgs_url}`);
});

elite_bgs_connection.on('error', err => {
    bugsnagCaller(err);
    console.log(`Mongoose error ${err}`);
});

(function () {
    let tracker = 0;
    elite_bgs_connection.on('disconnected', () => {
        console.log(`Mongoose connection to ${elite_bgs_url} disconnected`);
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
});

process.on('SIGINT', () => {
    elite_bgs_connection.close(() => {
        console.log(`Connection to ${elite_bgs_url} closed via app termination`);
    });
    process.exit(0);
});

module.exports.elite_bgs = elite_bgs_connection;
module.exports.mongoose = mongoose;
