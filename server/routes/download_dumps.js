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
        eddb.bodies.download()
            .then(msg => {
                res.json(msg);
            })
            .catch(err => {
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/commodity', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.commodities.download()
            .then(msg => {
                res.json(msg);
            })
            .catch(err => {
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/faction', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.factions.download()
            .then(msg => {
                res.json(msg);
            })
            .catch(err => {
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/station', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.stations.download()
            .then(msg => {
                res.json(msg);
            })
            .catch(err => {
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/populatedSystem', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.populatedSystems.download()
            .then(msg => {
                res.json(msg);
            })
            .catch(err => {
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

router.get('/system', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        eddb.systems.download()
            .then(msg => {
                res.json(msg);
            })
            .catch(err => {
                res.json(err);
            });
    } else {
        res.json({ Error: "Permission Denied" });
    }
});

module.exports = router;