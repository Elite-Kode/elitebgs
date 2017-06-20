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

const request = require('request-promise-native');
const express = require('express');
const passport = require('passport');

let router = express.Router();

let eddb = require('../modules/eddb');

router.get('/', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user.clearance === 0) {
        res.status(200).json({ message: 'started' });

        let bodiesDownload = () => {
            return new Promise((resolve, reject) => {
                let bodies = new eddb.bodies();
                bodies.download();
                bodies
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let commoditiesDownload = () => {
            return new Promise((resolve, reject) => {
                let commodities = new eddb.commodities();
                commodities.download();
                commodities
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let factionsDownload = () => {
            return new Promise((resolve, reject) => {
                let factions = new eddb.factions();
                factions.download();
                factions
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let stationsDownload = () => {
            return new Promise((resolve, reject) => {
                let stations = new eddb.stations();
                stations.download();
                stations
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let populatedSystemsDownload = () => {
            return new Promise((resolve, reject) => {
                let populatedSystems = new eddb.populatedSystems();
                populatedSystems.download();
                populatedSystems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let systemsDownload = () => {
            return new Promise((resolve, reject) => {
                let systems = new eddb.systems();
                systems.download();
                systems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let bodiesInsert = () => {
            return new Promise((resolve, reject) => {
                let bodies = new eddb.bodies();
                bodies.import();
                bodies
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let commoditiesInsert = () => {
            return new Promise((resolve, reject) => {
                let commodities = new eddb.commodities();
                commodities.import();
                commodities
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let factionsInsert = () => {
            return new Promise((resolve, reject) => {
                let factions = new eddb.factions();
                factions.import();
                factions
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let stationsInsert = () => {
            return new Promise((resolve, reject) => {
                let stations = new eddb.stations();
                stations.import();
                stations
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let populatedSystemsInsert = () => {
            return new Promise((resolve, reject) => {
                let populatedSystems = new eddb.populatedSystems();
                populatedSystems.import();
                populatedSystems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        let systemsInsert = () => {
            return new Promise((resolve, reject) => {
                let systems = new eddb.systems();
                systems.import();
                systems
                    .on('done', () => {
                        resolve();
                    })
                    .on('error', err => {
                        reject(err);
                    });
            });
        }

        bodiesDownload()
            .then(commoditiesDownload)
            .then(factionsDownload)
            .then(stationsDownload)
            .then(populatedSystemsDownload)
            .then(systemsDownload)
            .then(bodiesInsert)
            .then(commoditiesInsert)
            .then(factionsInsert)
            .then(stationsInsert)
            .then(populatedSystemsInsert)
            .then(systemsInsert)
            .catch(err => {
                console.log(err);
            });
    } else {
        res.status(403).json({ Error: "Permission Denied" });
    }
});

module.exports = router;