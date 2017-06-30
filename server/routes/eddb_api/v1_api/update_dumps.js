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

const request = require('request-promise-native');
const express = require('express');
const passport = require('passport');

let router = express.Router();

let eddb = require('../../../modules/eddb');

router.get('/body', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        let bodies = new eddb.bodies();
        bodies.update();
        bodies
            .on('started', msg => {
                res.status(msg.statusCode).json(msg);
            })
            .on('done', () => {
                console.log('Done');
            })
            .on('error', err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.status(403).json({ Error: "Permission Denied" });
    }
});

router.get('/commodity', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        let commodities = new eddb.commodities();
        commodities.update();
        commodities
            .on('started', msg => {
                res.status(msg.statusCode).json(msg);
            })
            .on('done', () => {
                console.log('Done');
            })
            .on('error', err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.status(403).json({ Error: "Permission Denied" });
    }
});

router.get('/faction', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        let factions = new eddb.factions();
        factions.update();
        factions
            .on('started', msg => {
                res.status(msg.statusCode).json(msg);
            })
            .on('done', () => {
                console.log('Done');
            })
            .on('error', err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.status(403).json({ Error: "Permission Denied" });
    }
});

router.get('/station', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        let stations = new eddb.stations();
        stations.update();
        stations
            .on('started', msg => {
                res.status(msg.statusCode).json(msg);
            })
            .on('done', () => {
                console.log('Done');
            })
            .on('error', err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.status(403).json({ Error: "Permission Denied" });
    }
});

router.get('/populatedsystem', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        let populatedSystems = new eddb.populatedSystems();
        populatedSystems.update();
        populatedSystems
            .on('started', msg => {
                res.status(msg.statusCode).json(msg);
            })
            .on('done', () => {
                console.log('Done');
            })
            .on('error', err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.status(403).json({ Error: "Permission Denied" });
    }
});

router.get('/system', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        let systems = new eddb.systems();
        systems.update();
        systems
            .on('started', msg => {
                res.status(msg.statusCode).json(msg);
            })
            .on('done', () => {
                console.log('Done');
            })
            .on('error', err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.status(403).json({ Error: "Permission Denied" });
    }
});

module.exports = router;