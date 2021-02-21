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
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const secrets = require('./secrets');
const swagger = require('./swagger');

const ebgsFactionsV1 = require('./routes/elite_bgs_api/v1/factions');
const ebgsSystemsV1 = require('./routes/elite_bgs_api/v1/systems');

const ebgsFactionsV2 = require('./routes/elite_bgs_api/v2/factions');
const ebgsSystemsV2 = require('./routes/elite_bgs_api/v2/systems');

const ebgsFactionsV3 = require('./routes/elite_bgs_api/v3/factions');
const ebgsSystemsV3 = require('./routes/elite_bgs_api/v3/systems');

const ebgsFactionsV4 = require('./routes/elite_bgs_api/v4/factions');
const ebgsSystemsV4 = require('./routes/elite_bgs_api/v4/systems');
const ebgsStationsV4 = require('./routes/elite_bgs_api/v4/stations');
const tickTimesV4 = require('./routes/elite_bgs_api/v4/tick_times');

const ebgsFactionsV5 = require('./routes/elite_bgs_api/v5/factions');
const ebgsSystemsV5 = require('./routes/elite_bgs_api/v5/systems');
const ebgsStationsV5 = require('./routes/elite_bgs_api/v5/stations');
const tickTimesV5 = require('./routes/elite_bgs_api/v5/tick_times');

const chartGenerator = require('./routes/chart_generator');
const ingameIds = require('./routes/ingame_ids');
const health = require('./routes/health');

const bugsnagClient = require('./bugsnag').bugsnagClient;

const app = express();

require('./db')

let bugsnagClientMiddleware = {}

if (secrets.bugsnag_use) {
    bugsnagClientMiddleware = bugsnagClient.getPlugin('express');
    app.use(bugsnagClientMiddleware.requestHandler);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (app.get('env') === 'development') {
    app.use(cors())
}

app.use('/api/ebgs/v1/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv1);
});

app.use('/api/ebgs/v2/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv2);
});

app.use('/api/ebgs/v3/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv3);
});

app.use('/api/ebgs/v4/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv4);
});

app.use('/api/ebgs/v5/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv5);
});

app.use('/api/ebgs/v1/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv1));
app.use('/api/ebgs/v2/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv2));
app.use('/api/ebgs/v3/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv3));
app.use('/api/ebgs/v4/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv4));
app.use('/api/ebgs/v5/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv5));

app.use('/api/ebgs/v4/factions', ebgsFactionsV4);
app.use('/api/ebgs/v4/systems', ebgsSystemsV4);
app.use('/api/ebgs/v4/stations', ebgsStationsV4);
app.use('/api/ebgs/v4/ticks', tickTimesV4);

app.use('/api/ebgs/v5/factions', ebgsFactionsV5);
app.use('/api/ebgs/v5/systems', ebgsSystemsV5);
app.use('/api/ebgs/v5/stations', ebgsStationsV5);
app.use('/api/ebgs/v5/ticks', tickTimesV5);

// Todo: Move the below APIs to /api

app.use('/api/chartgenerator', chartGenerator);
app.use('/api/ingameids', ingameIds);
app.use('/api/health', health);

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
