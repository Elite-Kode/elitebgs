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
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const ids = require('../id');

const ebgsFactionsV3Model = require('../models/ebgs_factions_v3');
const ebgsSystemsV3Model = require('../models/ebgs_systems_v3');

let router = express.Router();

router.get('/backgroundimages', (req, res, next) => {
    let pathToFile = path.resolve(__dirname, '../../src/assets/backgrounds');
    res.send(fs.readdirSync(pathToFile));
});

router.post('/edit', (req, res, next) => {
    console.log(req.body);
    if (validateEdit(req.body)) {
        ebgsSystemsV3Model
            .then(model => {
                model.findOne(
                    {
                        name_lower: req.body.name_lower,
                        x: req.body.x,
                        y: req.body.y,
                        z: req.body.z
                    },
                    { history: 0 }
                ).lean().then(system => {
                    req.body.factions.forEach(faction => {
                        if (system.factions.findIndex(element => {
                            return element.name_lower === faction.name_lower;
                        }) === -1) {
                            res.send(false);
                            return;
                        }
                    });
                    let controllingFactionPromise = new Promise((resolve, reject) => {
                        req.body.factions.forEach(faction => {
                            if (faction.name_lower === req.body.controlling_minor_faction) {
                                ebgsFactionsV3Model
                                    .then(model => {
                                        model.findOne(
                                            {
                                                name_lower: req.body.controlling_minor_faction
                                            },
                                            { history: 0 }
                                        ).lean().then(factionGot => {
                                            if (factionGot) {
                                                resolve([faction.state, factionGot]);
                                            } else {
                                                reject();
                                            }
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    }).catch(err => {
                                        reject(err);
                                    });
                            }
                        });
                    });
                    controllingFactionPromise
                        .then(data => {
                            let state = data[0];
                            let government = data[1].government;
                            let allegiance = data[1].allegiance;
                            let security = req.body.security;
                            state = ids.stateFDevArray[ids.stateIdsArray.indexOf(state)];
                            government = ids.governmentFDevArray[ids.governmentIdsArray.indexOf(government)];
                            allegiance = ids.allegianceFDevArray[ids.allegianceIdsArray.indexOf(allegiance)];
                            security = ids.securityFDevArray[ids.securityIdsArray.indexOf(security)];
                            let factions = [];
                            req.body.factions.forEach(faction => {
                                factions.push({
                                    name: faction.name,
                                    name_lower: faction.name_lower
                                });
                            });
                            let systemObject = {
                                population: req.body.population,
                                security: security,
                                state: state,
                                government: government,
                                allegiance: allegiance,
                                controlling_minor_faction: req.body.controlling_minor_faction.toLowerCase(),
                                updated_at: req.body.updated_at,
                                factions: factions
                            };
                            systemObject["$addToSet"] = {
                                history: {
                                    population: req.body.population,
                                    security: security,
                                    state: state,
                                    government: government,
                                    allegiance: allegiance,
                                    controlling_minor_faction: req.body.controlling_minor_faction.toLowerCase(),
                                    updated_at: req.body.updated_at,
                                    factions: rfactions,
                                    updated_by: "Test"
                                }
                            }
                            model.findOneAndUpdate(
                                {
                                    name_lower: req.body.name_lower,
                                    x: req.body.x,
                                    y: req.body.y,
                                    z: req.body.z
                                },
                                systemObject,
                                {
                                    upsert: false,
                                    runValidators: true
                                })
                                .exec()
                                .catch((err) => {
                                    res.send(false);
                                });
                        }).catch(err => {
                            res.send(false);
                        });
                }).catch(err => {
                    res.send(false);
                });
            }).catch(err => {
                res.send(false);
            });
    } else {
        res.send(false);
    }
});

let validateEdit = data => {
    let valid = true;
    if (_.has(data, '_id')
        && _.has(data, 'name')
        && _.has(data, 'name_lower')
        && _.has(data, 'x')
        && _.has(data, 'y')
        && _.has(data, 'z')
        && _.has(data, 'population')
        && _.has(data, 'security')
        && _.has(data, 'controlling_minor_faction')
        && _.has(data, 'updated_at')
        && _.has(data, 'factions')
        && data.name.toLowerCase() === data.name_lower) {
        if (ids.securityIdsArray.indexOf(data.security) === -1) {
            return false;
        }
        if (data.factions.findIndex(element => {
            if (_.has(element, 'name_lower')) {
                return element.name_lower === data.controlling_minor_faction;
            }
        }) === -1) {
            return false;
        }
        let totalInfluence = 0;
        data.factions.forEach(faction => {
            if (faction) {
                if (_.has(faction, 'name')
                    && _.has(faction, 'name_lower')
                    && _.has(faction, 'influence')
                    && _.has(faction, 'state')
                    && _.has(faction, 'pending_states')
                    && _.has(faction, 'recovering_states')
                    && faction.name.toLowerCase() === faction.name_lower) {
                    if (ids.stateIdsArray.indexOf(faction.state) === -1) {
                        valid = false;
                        return;
                    }
                    faction.pending_states.forEach(state => {
                        if (state) {
                            if (_.has(state, 'state')
                                && _.has(state, 'trend')) {
                                if (ids.stateIdsArray.indexOf(state.state) === -1) {
                                    valid = false;
                                    return;
                                }
                                if (state.trend !== -1 && state.trend !== 0 && state.trend !== 1) {
                                    valid = false;
                                    return;
                                }
                            } else {
                                valid = false;
                                return;
                            }
                        }
                    });
                    faction.recovering_states.forEach(state => {
                        if (state) {
                            if (_.has(state, 'state')
                                && _.has(state, 'trend')) {
                                if (ids.stateIdsArray.indexOf(state.state) === -1) {
                                    valid = false;
                                    return;
                                }
                                if (state.trend !== -1 && state.trend !== 0 && state.trend !== 1) {
                                    valid = false;
                                    return;
                                }
                            } else {
                                valid = false;
                                return;
                            }
                        }
                    });
                    if (!valid) {
                        return;
                    }
                    totalInfluence += faction.influence;
                } else {
                    valid = false;
                    return;
                }
            } else {
                valid = false;
                return;
            }
        });
        if (totalInfluence !== 1) {
            return false;
        }
        return valid;
    } else {
        return false;
    }
}

module.exports = router;
