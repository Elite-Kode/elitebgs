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
    res.send(req.isAuthenticated());
});

router.get('/edit', (req, res) => {
    if (req.user) {
        if (req.user.access === 0 || req.user.access === 3) {
            res.send(true);
        } else {
            let editableFactions = req.user.editable_factions;
            let systemName = req.query.name;
            require('../../models/ebgs_factions_v4')
                .then(model => {
                    let factionPromise = [];
                    editableFactions.forEach(faction => {
                        factionPromise.push(new Promise((resolve, reject) => {
                            model.findOne(
                                { name_lower: faction.name_lower }
                            ).lean().then(gotFaction => {
                                if (gotFaction && gotFaction.faction_presence.findIndex(element => {
                                    return element.system_name_lower === systemName.toLowerCase();
                                }) !== -1) {
                                    resolve(true);
                                } else {
                                    resolve(false)
                                }
                            }).catch(err => {
                                reject(err);
                            });
                        }));
                    });
                    Promise.all(factionPromise)
                        .then(checks => {
                            if (checks.indexOf(true) !== -1) {
                                res.send(true);
                            } else {
                                res.send(false);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.send(false);
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.send(false);
                });
        }
    } else {
        res.send(false);
    }
})

module.exports = router;
