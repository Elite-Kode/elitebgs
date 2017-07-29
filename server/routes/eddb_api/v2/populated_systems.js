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

router.get('/', passport.authenticate('basic', { session: false }), (req, res, next) => {
    require('../../../models/populated_systems')
        .then(populatedSystems => {
            let query = new Object;
            let factionSearch = null;

            if (req.query.eddbid) {
                query.id = req.query.eddbid;
            }
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
                let powers = arrayfy(req.query.power);
                query.power = { $in: powers };
            }
            if (req.query.powerstatename) {
                let powerStates = arrayfy(req.query.powerstatename);
                query.power_state = { $in: powerStates };
            }
            if (req.query.permit) {
                query.needs_permit = boolify(req.query.permit);
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
                    factionSearch = new Promise((resolve, reject) => {
                        require('../../../models/factions')
                            .then(factions => {
                                let factionQuery = new Object;

                                factionQuery.name_lower = req.query.factionname.toLowerCase();

                                let factionProjection = {
                                    _id: 0,
                                    id: 1
                                }

                                factions.find(factionQuery, factionProjection).lean()
                                    .then(result => {
                                        let ids = [];
                                        result.forEach(doc => {
                                            ids.push(doc.id);
                                        }, this);
                                        resolve(ids);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            })
                            .catch(err => {
                                reject(err);
                            });
                    })
                }
            }

            let systemSearch = () => {
                if (_.isEmpty(query) && req.user.clearance !== 0) {
                    throw new Error("Add at least 1 query parameter to limit traffic");
                }
                let paginateOptions = {
                    lean: true,
                    page: page,
                    limit: 10
                };
                populatedSystems.paginate(query, paginateOptions)
                    .then(result => {
                        res.status(200).json(result);
                    })
                    .catch(next)
            }

            if (factionSearch instanceof Promise) {
                factionSearch
                    .then(ids => {
                        query["minor_faction_presences.minor_faction_id"] = { $in: ids };
                        systemSearch();
                    })
                    .catch(next)
            } else {
                systemSearch();
            }

        })
        .catch(next);
});

let arrayfy = requestParam => {
    let regex = /\s*,\s*/;
    let mainArray = requestParam.split(regex);

    mainArray.forEach((element, index, allElements) => {
        allElements[index] = element.toLowerCase();
    }, this);

    return mainArray;
}

let boolify = requestParam => {
    if (requestParam.toLowerCase() === "true") {
        return true;
    } else if (requestParam.toLowerCase() === "false") {
        return false;
    } else {
        return false;
    }
}

module.exports = router;
