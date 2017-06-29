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
    require('../../../models/populated_systems')
        .then(populatedSystems => {
            let query = new Object;

            if (req.query.name) {
                query.name_lower = req.query.name.toLowerCase();
            }
            if (req.query.allegiancename) {
                query.allegiance = req.query.allegiancename.toLowerCase();
            }
            if (req.query.governmentname) {
                query.government = req.query.governmentname.toLowerCase();
            }
            if (req.query.statename) {
                query.state = req.query.statename.toLowerCase();
            }
            if (req.query.primaryeconomyname) {
                query.primary_economy = req.query.primaryeconomyname.toLowerCase();
            }
            if (req.query.power) {
                query.power = req.query.power.toLowerCase();
            }
            if (req.query.powerstatename) {
                query.power_state = req.query.powerstatename.toLowerCase();
            }
            if (req.query.permit) {
                query.needs_permit = req.query.permit;
            }
            if (req.query.securityname) {
                query.security = req.query.securityname.toLowerCase();
            }
            if (req.query.factionname) {
                let presencetype = 'presence';
                if (req.query.presencetype) {
                    presencetype = req.query.presencetype.toLowerCase();
                }
                if (presencetype === 'controlling') {
                    query.controlling_minor_faction = req.query.factionname.toLowerCase();
                } else if (presencetype === 'presence') {
                    require('../../../models/factions')
                        .then(factions => {
                            let factionQuery = new Object;

                            factionQuery.name_lower = req.query.factionname;

                            factions.find(factionQuery).lean()
                                .then(result => {
                                    query["minor_faction_presences.minor_faction_id"] = result.id;
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
            if (_.isEmpty(query) && req.user.clearance !== 0) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            populatedSystems.find(query).lean()
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
    require('../../../models/populated_systems')
        .then(populatedSystems => {
            let name = req.params.name;
            populatedSystems.find({ name: name }).lean()
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