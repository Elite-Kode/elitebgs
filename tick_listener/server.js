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

const express = require('express');
const logger = require('morgan');
const secrets = require('./secrets');

const bugsnagClient = require('./bugsnag').bugsnagClient;

require('./listener');

const app = express();

require('./db')

let bugsnagClientMiddleware = {}

if (secrets.bugsnag_use) {
    bugsnagClientMiddleware = bugsnagClient.getPlugin('express');
    app.use(bugsnagClientMiddleware.requestHandler);
}

// error handlers
if (secrets.bugsnag_use) {
    app.use(bugsnagClientMiddleware.errorHandler);
}

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(logger('dev'));
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
        console.log(err);
    });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
    app.use(logger('combined'));
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
