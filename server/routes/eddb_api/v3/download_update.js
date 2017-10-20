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

let router = express.Router();

let eddb = require('../../../modules/eddb');

router.get('/', passport.authenticate('basic', { session: false }), (req, res, next) => {
    if (req.user.clearance === 0) {
        res.status(200).json({ message: 'started' });

        let bodiesDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let bodies = new eddb.bodies();
                bodies.downloadUpdate();
                bodies
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let commoditiesDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let commodities = new eddb.commodities();
                commodities.downloadUpdate();
                commodities
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let factionsDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let factions = new eddb.factions();
                factions.downloadUpdate();
                factions
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let stationsDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let stations = new eddb.stations();
                stations.downloadUpdate();
                stations
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let populatedSystemsDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let populatedSystems = new eddb.populatedSystems();
                populatedSystems.downloadUpdate();
                populatedSystems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let systemsDownloadUpdate = () => {
            return new Promise((resolve, reject) => {
                let systems = new eddb.systems();
                systems.downloadUpdate();
                systems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        bodiesDownloadUpdate()
            .then(commoditiesDownloadUpdate)
            .then(factionsDownloadUpdate)
            .then(stationsDownloadUpdate)
            .then(populatedSystemsDownloadUpdate)
            .then(systemsDownloadUpdate)
            .catch(next);
    } else {
        res.status(403).json({ Error: "Permission Denied" });
    }
});

module.exports = router;
