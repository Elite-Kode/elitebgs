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
const _ = require('lodash');

let router = express.Router();

router.get('/', passport.authenticate('basic', { session: false }), (req, res) => {
    require('../models/stations')
        .then(stations => {
            let query = new Object;

            if (req.query.controllingfaction) {
                query.controlling_minor_faction_id = req.query.controllingfaction;
            }
            if (req.query.allegiance) {
                query.allegiance_id = req.query.allegiance;
            }
            if (req.query.government) {
                query.government_id = req.query.government;
            }
            if (req.query.planetary) {
                query.is_planetary = req.query.planetary;
            }
            if (_.isEmpty(query) && req.user.clearance !== 0) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            stations.find(query)
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

router.get('/name/:name', (req, res) => {
    require('../models/stations')
        .then(stations => {
            let name = req.params.name;
            stations.find({ name: name })
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

module.exports = router;