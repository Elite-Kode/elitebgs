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

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const basicStrategy = require('passport-http').BasicStrategy;

const bugsnag = require('./server/bugsnag');
const swagger = require('./server/swagger');

const bodiesV1 = require('./server/routes/eddb_api/v1/bodies');
const commoditiesV1 = require('./server/routes/eddb_api/v1/commodities');
const factionsV1 = require('./server/routes/eddb_api/v1/factions');
const populatedSystemsV1 = require('./server/routes/eddb_api/v1/populated_systems');
const stationsV1 = require('./server/routes/eddb_api/v1/stations');
const systemsV1 = require('./server/routes/eddb_api/v1/systems');
const downloadDumpsV1 = require('./server/routes/eddb_api/v1/download_dumps');
const insertDumpsV1 = require('./server/routes/eddb_api/v1/insert_dumps');
const updateDumpsV1 = require('./server/routes/eddb_api/v1/update_dumps');
const downloadInsertV1 = require('./server/routes/eddb_api/v1/download_insert');
const downloadUpdateV1 = require('./server/routes/eddb_api/v1/download_update');

const ebgsFactionsV1 = require('./server/routes/elite_bgs_api/v1/factions');
const ebgsSystemsV1 = require('./server/routes/elite_bgs_api/v1/systems');

const bodiesV2 = require('./server/routes/eddb_api/v2/bodies');
const factionsV2 = require('./server/routes/eddb_api/v2/factions');
const populatedSystemsV2 = require('./server/routes/eddb_api/v2/populated_systems');
const stationsV2 = require('./server/routes/eddb_api/v2/stations');
const systemsV2 = require('./server/routes/eddb_api/v2/systems');

const ebgsFactionsV2 = require('./server/routes/elite_bgs_api/v2/factions');
const ebgsSystemsV2 = require('./server/routes/elite_bgs_api/v2/systems');

require('./server/modules/eddn');

const app = express();

// app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
app.use(bugsnag.requestHandler);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger);
});

app.use('/api/eddb/v1/bodies', bodiesV1);
app.use('/api/eddb/v1/commodities', commoditiesV1);
app.use('/api/eddb/v1/factions', factionsV1);
app.use('/api/eddb/v1/populatedsystems', populatedSystemsV1);
app.use('/api/eddb/v1/stations', stationsV1);
app.use('/api/eddb/v1/systems', systemsV1);
app.use('/api/eddb/v1/downloaddumps', downloadDumpsV1);
app.use('/api/eddb/v1/insertdumps', insertDumpsV1);
app.use('/api/eddb/v1/updatedumps', updateDumpsV1);
app.use('/api/eddb/v1/downloadinsert', downloadInsertV1);
app.use('/api/eddb/v1/downloadupdate', downloadUpdateV1);

app.use('/api/eddb/docs', swaggerUi.serve, swaggerUi.setup(null, null, null, null, null, 'http://localhost:3001/api/api-docs.json'));

app.use('/api/ebgs/v1/factions', ebgsFactionsV1);
app.use('/api/ebgs/v1/systems', ebgsSystemsV1);

app.use('/api/eddb/v2/bodies', bodiesV2);
app.use('/api/eddb/v2/factions', factionsV2);
app.use('/api/eddb/v2/populatedsystems', populatedSystemsV2);
app.use('/api/eddb/v2/stations', stationsV2);
app.use('/api/eddb/v2/systems', systemsV2);

app.use('/api/ebgs/v2/factions', ebgsFactionsV2);
app.use('/api/ebgs/v2/systems', ebgsSystemsV2);

// Pass all 404 errors called by browser to angular
app.all('*', (req, res) => {
    console.log(`Server 404 request: ${req.originalUrl}`);
    res.status(200).sendFile(path.join(__dirname, 'dist', 'index.html'))
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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
    app.use(bugsnag.errorHandler);
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
}

require('./server/models/users')
    .then(user => {
        passport.use(new basicStrategy((username, password, callback) => {
            user.findOne({ username: username })
                .then(user => {
                    if (user.password === password) {
                        return callback(null, user);
                    } else {
                        return callback(null, false);
                    }
                })
                .catch(err => {
                    console.log(err);
                    callback(err);
                })
        }));
    })
    .catch(err => {
        console.log(err);
    })

module.exports = app;
