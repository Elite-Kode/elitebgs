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
    require('../models/bodies')
        .then(bodies => {
            let query = new Object;

            if (req.query.ringtype) {
                query.ring_type_id = req.query.ringtype;
            }
            if (req.query.system) {
                query.system_id = req.query.system;
            }
            if (req.query.bodygroup) {
                query.group_id = req.query.bodygroup;
            }
            if (req.query.distancearrival) {
                query.distance_to_arrival = req.query.distancearrival;
            }
            if (req.query.landable) {
                query.is_landable = req.query.landable;
            }
            if (_.isEmpty(query) && req.user.clearance !== 0) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            bodies.find(query)
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

router.get('/name/:name', (req, res) => {
    require('../models/bodies')
        .then(bodies => {
            let name = req.params.name;
            bodies.find({ name: name })
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

module.exports = router;