/*
 * KodeBlox Copyright 2021 Sayak Mukhopadhyay
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
let elite_bgs_url = require('./secrets').elite_bgs_db_url;
let elite_bgs_db_user = require('./secrets').elite_bgs_db_user
let elite_bgs_db_pwd = require('./secrets').elite_bgs_db_pwd

let options = {
    keepAlive: true,
    keepAliveInitialDelay: 120000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: elite_bgs_db_user,
    pass: elite_bgs_db_pwd
}

mongoose.connect(elite_bgs_url, options, err => {
    if (err) {
        bugsnagCaller(err);
        console.log(err);
    }
});


mongoose.connection.on('connected', () => {
    console.log(`Connected to ${elite_bgs_url}`);
});

mongoose.connection.on('error', err => {
    bugsnagCaller(err);
    console.log(`Mongoose error ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log(`Connection to ${elite_bgs_url} closed via app termination`);
    process.exit(0);
});
