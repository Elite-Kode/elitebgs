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
    require('../../../models/ebgs_systems')
        .then(systems => {
            let query = new Object;
            let page = 1;

            if (req.query.name) {
                query.name_lower = req.query.name.toLowerCase();
            }
            if (req.query.allegiance) {
                query.allegiance = req.query.allegiance.toLowerCase();
            }
            if (req.query.government) {
                query.government = req.query.government.toLowerCase();
            }
            if (req.query.state) {
                query.state = req.query.state.toLowerCase();
            }
            if (req.query.primaryeconomy) {
                query.primary_economy = req.query.primaryeconomy.toLowerCase();
            }
            if (req.query.power) {
                let powers = arrayfy(req.query.power);
                query.power = { $in: powers };
            }
            if (req.query.powerstate) {
                let powerStates = arrayfy(req.query.powerstate);
                query.power_state = { $in: powerStates };
            }
            if (req.query.security) {
                query.security = req.query.security.toLowerCase();
            }
            if (_.isEmpty(query) && req.user.clearance !== 0) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            if (req.query.page) {
                page = req.query.page;
            }
            let paginateOptions = {
                lean: true,
                page: page,
                limit: 10
            };
            systems.paginate(query, paginateOptions)
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(next)
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

module.exports = router;
