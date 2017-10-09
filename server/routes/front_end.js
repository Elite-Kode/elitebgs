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

let router = express.Router();

router.get('/backgroundimages', (req, res, next) => {
    let pathToFile = path.resolve(__dirname, '../../src/assets/backgrounds');
    res.send(fs.readdirSync(pathToFile));
});

router.post('/edit', (req, res, next) => {
    console.log(req.body);
    if (validateEdit(req.body)) {
        res.send(true);
    } else {
        res.send(false);
    }
});

let validateEdit = data => {
    if (_.has(data, '_id')
        && _.has(data, 'name')
        && _.has(data, 'name_lower')
        && _.has(data, 'x')
        && _.has(data, 'y')
        && _.has(data, 'z')
        && _.has(data, 'population')
        && _.has(data, 'primary_economy')
        && _.has(data, 'controlling_minor_faction')
        && _.has(data, 'updated_at')
        && _.has(data, 'factions')
        && data.name.toLowerCase() === data.name_lower) {
        let economyFound = false;
        for (economy in ids.fdevEconomyId) {
            console.log(economy);
            if (ids.fdevEconomyId[economy].name === data.primary_economy) {
                economyFound = true;
            }
        }
        if (!economyFound) {
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
                    totalInfluence += faction.influence;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
        if (totalInfluence !== 1) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

module.exports = router;
