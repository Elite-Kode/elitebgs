"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const bodies = require('./server/routes/bodies');
const commodities = require('./server/routes/commodities');
const factions = require('./server/routes/factions');
const populatedSystems = require('./server/routes/populated_systems');
const stations = require('./server/routes/stations');
const systems = require('./server/routes/systems');
const downloadDumps = require('./server/routes/download_dumps');
const insertDumps = require('./server/routes/insert_dumps');

// require('./server/modules/eddn');

const app = express();

// app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/bodies', bodies);
app.use('/api/commodities', commodities);
app.use('/api/factions', factions);
app.use('/api/populatedsystems', populatedSystems);
app.use('/api/stations', stations);
app.use('/api/systems', systems);
app.use('/api/downloaddumps', downloadDumps);
app.use('/api/insertdumps', insertDumps);

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

module.exports = app;