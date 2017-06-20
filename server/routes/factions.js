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
    require('../models/factions')
        .then(factions => {
            let query = new Object;

            if (req.query.allegiancename) {
                query.allegiance = req.query.allegiance;
            }
            if (req.query.governmentname) {
                query.government = req.query.governmentname;
            }
            if (req.query.statename) {
                query.state = req.query.statename;
            }
            if (req.query.playerfaction) {
                query.is_player_faction = req.query.playerfaction;
            }
            if (req.query.homesystemname || req.query.power) {
                require('../models/systems')
                    .then(systems => {
                        let systemQuery = new Object;

                        if (req.query.systemname) {
                            systemQuery.name = req.query.homesystemname;
                            systemQuery.power = req.query.power;
                        }
                        systems.find(systemQuery)
                            .then(result => {
                                query.system_id = result.id;
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            if (_.isEmpty(query) && req.user.clearance !== 0) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            factions.find(query)
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/name/:name', (req, res) => {
    require('../models/factions')
        .then(factions => {
            factions.find({ name: name })
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;