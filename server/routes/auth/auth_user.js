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
    if (req.user) {
        res.send(req.user);
    } else {
        res.send({});
    }
});

router.post('/edit', (req, res) => {
    if (req.user) {
        require('../../models/ebgs_users')
            .then(users => {
                let user = req.user;
                let factionPromise = [];
                let systemPromise = [];
                let stationPromise = [];
                if (req.body.factions) {
                    arrayfy(req.body.factions).forEach(faction => {
                        if (user.factions.findIndex(element => {
                            return element.name_lower === faction.toLowerCase();
                        }) === -1) {
                            factionPromise.push(new Promise((resolve, reject) => {
                                require('../../models/ebgs_factions_v4')
                                    .then(model => {
                                        model.findOne(
                                            {
                                                name_lower: faction.toLowerCase()
                                            }
                                        ).lean().then(factionGot => {
                                            if (factionGot) {
                                                user.factions.push({
                                                    name: faction,
                                                    name_lower: faction.toLowerCase()
                                                });
                                                resolve();
                                            } else {
                                                reject(new Error("Faction not present"));
                                            }
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    }).catch(err => {
                                        reject(err);
                                    });
                            }));
                        }
                    });
                }
                if (req.body.systems) {
                    arrayfy(req.body.systems).forEach(system => {
                        if (user.systems.findIndex(element => {
                            return element.name_lower === system.toLowerCase();
                        }) === -1) {
                            systemPromise.push(new Promise((resolve, reject) => {
                                require('../../models/ebgs_systems_v4')
                                    .then(model => {
                                        model.findOne(
                                            {
                                                name_lower: system.toLowerCase()
                                            }
                                        ).lean().then(systemGot => {
                                            if (systemGot) {
                                                user.systems.push({
                                                    name: system,
                                                    name_lower: system.toLowerCase()
                                                });
                                                resolve();
                                            } else {
                                                reject(new Error("System not present"));
                                            }
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    }).catch(err => {
                                        reject(err);
                                    });
                            }));
                        }
                    });
                }
                if (req.body.stations) {
                    arrayfy(req.body.stations).forEach(station => {
                        if (user.stations.findIndex(element => {
                            return element.name_lower === station.toLowerCase();
                        }) === -1) {
                            stationPromise.push(new Promise((resolve, reject) => {
                                require('../../models/ebgs_stations_v4')
                                    .then(model => {
                                        model.findOne(
                                            {
                                                name_lower: station.toLowerCase()
                                            }
                                        ).lean().then(stationGot => {
                                            if (stationGot) {
                                                user.stations.push({
                                                    name: station,
                                                    name_lower: station.toLowerCase()
                                                });
                                                resolve();
                                            } else {
                                                reject(new Error("Station not present"));
                                            }
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    }).catch(err => {
                                        reject(err);
                                    });
                            }));
                        }
                    });
                }
                Promise.all(factionPromise.concat(systemPromise).concat(stationPromise))
                    .then(() => {
                        users.findOneAndUpdate(
                            {
                                _id: req.user._id
                            },
                            user,
                            {
                                upsert: false,
                                runValidators: true
                            })
                            .then(user => {
                                res.send(true);
                            })
                            .catch(err => {
                                console.log(err);
                                res.send(false);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        res.send(false);
                    })
            })
            .catch(err => {
                console.log(err)
                res.send(false);
            });
    }
});

router.delete('/edit', (req, res) => {
    if (req.user) {
        require('../../models/ebgs_users')
            .then(users => {
                let user = req.user;
                if (req.query.faction) {
                    let index = user.factions.findIndex(element => {
                        return element.name_lower === req.query.faction.toLowerCase();
                    });
                    if (index !== -1) {
                        user.factions.splice(index, 1);
                    } else {
                        res.send(false);
                        return;
                    }
                }
                if (req.query.editablefaction) {
                    let index = user.editable_factions.findIndex(element => {
                        return element.name_lower === req.query.editablefaction.toLowerCase();
                    });
                    if (index !== -1) {
                        user.editable_factions.splice(index, 1);
                    } else {
                        res.send(false);
                        return;
                    }
                }
                if (req.query.system) {
                    let index = user.systems.findIndex(element => {
                        return element.name_lower === req.query.system.toLowerCase();
                    });
                    if (index !== -1) {
                        user.systems.splice(index, 1);
                    } else {
                        res.send(false);
                        return;
                    }
                }
                users.findOneAndUpdate(
                    {
                        _id: req.user._id
                    },
                    user,
                    {
                        upsert: false,
                        runValidators: true
                    })
                    .then(user => {
                        res.send(true);
                    })
                    .catch(err => {
                        console.log(err);
                        res.send(false);
                    });
            })
            .catch(err => {
                console.log(err)
                res.send(false);
            });
    }
});

router.delete('/delete', (req, res) => {
    if (req.user && (req.user._id === req.query.userid || req.user.access === 0)) {
        require('../../models/ebgs_users')
            .then(users => {
                users.findByIdAndRemove(req.query.userid)
                    .then(user => {
                        res.send(true);
                    })
                    .catch(err => {
                        console.log(err);
                        res.send(false);
                    });
            })
            .catch(err => {
                console.log(err)
                res.send(false);
            });
    }
});

let arrayfy = requestParam => {
    let regex = /\s*,\s*/;
    let mainArray = requestParam.split(regex);

    mainArray.forEach((element, index, allElements) => {
        allElements[index] = element;
    });

    return mainArray;
}

module.exports = router;
