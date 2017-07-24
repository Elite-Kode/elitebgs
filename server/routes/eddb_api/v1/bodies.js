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
    require('../../../models/bodies')
        .then(bodies => {
            let query = new Object;
            let systemSearch = null;

            if (req.query.name) {
                query.name_lower = req.query.name.toLowerCase();
            }
            if (req.query.materials) {
                let materials = arrayfy(req.query.materials);
                query["materials.material_name"] = { $all: materials };
            }
            if (req.query.systemname || req.query.reservetypename || req.query.ispopulated || req.query.power) {
                systemSearch = new Promise((resolve, reject) => {
                    require('../../../models/systems')
                        .then(systems => {
                            let systemQuery = new Object;

                            if (req.query.systemname) {
                                systemQuery.name_lower = req.query.systemname.toLowerCase();
                            }
                            if (req.query.reservetypename) {
                                systemQuery.reserve_type = req.query.reservetypename.toLowerCase();
                            }
                            if (req.query.ispopulated) {
                                systemQuery.is_populated = boolify(req.query.ispopulated);
                            }
                            if (req.query.power) {
                                systemQuery.power = req.query.power.toLowerCase();
                            }
                            systems.find(systemQuery).lean()
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
            if (req.query.ringtypename) {
                query.ring_type_name = req.query.ringtypename.toLowerCase();
            }
            if (req.query.bodygroupname) {
                let bodyGroupNames = arrayfy(req.query.bodygroupname);
                query.group_name = { $in: bodyGroupNames };
            }
            if (req.query.hasrings) {
                if (req.query.hasrings.toLowerCase() === "true") {
                    query.rings = { $exists: true, $ne: [] };
                } else if (req.query.hasrings.toLowerCase() === "false") {
                    query.rings = { $exists: true, $eq: [] };
                }
            }
            if (req.query.bodytypename) {
                let bodyTypeNames = arrayfy(req.query.bodytypename);
                query.type = { $in: bodyTypeNames };
            }
            if (req.query.distancearrival) {
                query.distance_to_arrival = { $lt: req.query.distancearrival };
            }
            if (req.query.ismainstar) {
                query.is_main_star = boolify(req.query.ismainstar);
            }
            if (req.query.specclass) {
                let specClass = arrayfy(req.query.specclass);
                query.spectral_class = { $in: specClass };
            }
            if (req.query.lumoclass) {
                let lumoClass = arrayfy(req.query.lumoclass);
                query.luminosity_class = { $in: lumoClass };
            }
            if (req.query.landable) {
                query.is_landable = boolify(req.query.landable);
            }
            if (req.query.idnext) {
                query._id = { $gt: req.query.idnext };
            }

            let bodySearch = () => {
                if (_.isEmpty(query) && req.user.clearance !== 0) {
                    throw new Error("Add at least 1 query parameter to limit traffic");
                }
                bodies.find(query).limit(10).lean()
                    .then(result => {
                        res.status(200).json(result);
                    })
                    .catch(next)
            }

            if (systemSearch instanceof Promise) {
                systemSearch
                    .then(ids => {
                        query.system_id = { $in: ids };
                        bodySearch();
                    })
                    .catch(next)
            } else {
                bodySearch();
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
