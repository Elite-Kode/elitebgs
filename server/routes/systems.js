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

let router = express.Router();

router.get('/', (req, res) => {
    require('../models/systems')
        .then(systems => {
            let query = new Object;

            if (req.query.allegiance) {
                query.allegiance_id = req.query.allegiance;
            }
            if (req.query.government) {
                query.government_id = req.query.government;
            }
            if (req.query.state) {
                query.state_id = req.query.state;
            }
            if (req.query.primaryeconomy) {
                query.primary_economy_id = req.query.primaryeconomy;
            }
            if (req.query.permit) {
                query.needs_permit = req.query.permit;
            }
            if (req.query.security) {
                query.security_id = req.query.security;
            }
            populatedSystem.find(query)
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
    require('../models/systems')
        .then(systems => {
            let name = req.params.name;
            systems.find({ name: name })
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