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
const passport = require('passport');

let router = express.Router();

let eddb = require('../modules/eddb');

router.get('/body', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.bodies.import()
            .then(() => {
                console.log("Bodies records updated from EDDB");
                res.json({
                    updated: true,
                    type: 'body'
                });
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/commodity', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.commodities.import()
            .then(() => {
                console.log("Commodities records updated from EDDB");
                res.json({
                    updated: true,
                    type: 'commodity'
                });
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/faction', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.factions.import()
            .then(() => {
                console.log("Factions records updated from EDDB");
                res.json({
                    updated: true,
                    type: 'faction'
                });
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/station', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.stations.import()
            .then(() => {
                console.log("Stations records updated from EDDB");
                res.json({
                    updated: true,
                    type: 'station'
                });
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/populatedSystem', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.populatedSystems.import()
            .then(() => {
                console.log("Populated systems records updated from EDDB");
                res.json({
                    updated: true,
                    type: 'populated system'
                });
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/system', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.systems.import()
            .then(() => {
                console.log("Systems records updated from EDDB");
                res.json({
                    updated: true,
                    type: 'system'
                });
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

module.exports = router;