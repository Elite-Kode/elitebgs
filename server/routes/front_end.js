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

const ebgsFactionsV4Model = require('../models/ebgs_factions_v4');
const ebgsSystemsV4Model = require('../models/ebgs_systems_v4');

const ebgsUsers = require('../models/ebgs_users');

let router = express.Router();

router.get('/backgroundimages', (req, res, next) => {
    let pathToFile = path.resolve(__dirname, '../../dist/assets/backgrounds');
    res.send(fs.readdirSync(pathToFile));
});

router.get('/donors', (req, res, next) => {
    ebgsUsers
        .then(users => {
            users.aggregate().unwind('donation').project({
                amount: "$donation.amount",
                date: "$donation.date",
                username: 1
            }).sort({
                date: -1
            }).then(donations => {
                res.send(donations);
            }).catch(err => {
                console.log(err);
                res.send();
            });
        })
        .catch(err => {
            console.log(err)
            res.send();
        });
});

router.get('/patrons', (req, res, next) => {
    ebgsUsers
        .then(users => {
            users.aggregate().match({
                "patronage.level": { $gt: 0 }
            }).project({
                level: "$patronage.level",
                since: "$patronage.since",
                username: 1
            }).sort({
                since: -1
            }).then(patrons => {
                res.send(patrons);
            }).catch(err => {
                console.log(err);
                res.send();
            });
        })
        .catch(err => {
            console.log(err)
            res.send();
        });
});

router.get('/credits', (req, res, next) => {
    ebgsUsers
        .then(users => {
            users.aggregate().match({
                $or: [
                    { os_contribution: { $gt: 0 } },
                    { "patronage.level": { $gt: 1 } }
                ]
            }).project({
                username: 1,
                avatar: 1,
                id: 1,
                os_contribution: 1,
                level: "$patronage.level"
            }).sort({
                since: -1
            }).then(credits => {
                res.send(credits);
            }).catch(err => {
                console.log(err);
                res.send();
            });
        })
        .catch(err => {
            console.log(err)
            res.send();
        });
});

router.get('/users', (req, res, next) => {
    if (req.user.access === 0) {
        ebgsUsers
            .then(users => {
                let query = new Object;
                let page = 1;
                if (req.query.id) {
                    query._id = req.query.id;
                }
                if (req.query.beginsWith) {
                    query["$or"] = [
                        {
                            username: {
                                $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`, 'i')
                            }
                        },
                        {
                            id: {
                                $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`, 'i')
                            }
                        }
                    ]
                }
                if (req.query.page) {
                    page = req.query.page;
                }
                let paginateOptions = {
                    lean: true,
                    page: page,
                    limit: 10,
                    leanWithId: false
                };
                users.paginate(query, paginateOptions)
                    .then(result => {
                        res.status(200).json(result);
                    })
                    .catch(next)
            })
            .catch(next)
    } else {
        next();
    }
});

router.put('/users', (req, res, next) => {
    try {
        if (req.user.access === 0 || req.user._id.toString() === req.body._id) {
            ebgsUsers
                .then(users => {
                    let body = req.body;
                    body.$unset = {};
                    for (const key in body) {
                        if (body.hasOwnProperty(key)) {
                            const element = body[key];
                            if (element === null) {
                                delete body[key];
                                body.$unset[key] = 1;
                            }
                        }
                    }
                    if (_.isEmpty(body.$unset)){
                        delete body.$unset
                    }
                    if (validateUser(body)) {
                        users.findOneAndUpdate(
                            {
                                _id: body._id
                            },
                            body,
                            {
                                upsert: false,
                                runValidators: true
                            }).then(data => {
                                res.send(true);
                            }).catch((err) => {
                                console.log(err);
                                res.send(false);
                            });
                    } else {
                        res.send(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.send(false);
                })
        } else {
            res.send(false);
        }
    } catch (error) {
        console.log(error);
        res.send(false);
    }
});

router.get('/scripts', (req, res, next) => {
    if (req.user.access === 0) {
        let pathToFile = path.resolve(__dirname, '../modules/scripts');
        fs.readdir(pathToFile)
            .then(files => {
                res.send(files);
            })
            .catch(next);
    } else {
        next();
    }
});

router.put('/scripts/run', (req, res, next) => {
    try {
        if (req.user.access === 0) {
            let script = require(`../modules/scripts/${req.body.script}`);
            script.run();
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        console.log(error);
        res.send(false);
    }
});

router.get('/factions', (req, res, next) => {
    let query = new Object;
    let page = 1;
    let history = false;
    let greaterThanTime;
    let lesserThanTime;

    if (req.query.id) {
        query._id = req.query.id;
    }
    if (req.query.name) {
        query.name_lower = req.query.name.toLowerCase();
    }
    if (req.query.allegiance) {
        query.allegiance = req.query.allegiance.toLowerCase();
    }
    if (req.query.government) {
        query.government = req.query.government.toLowerCase();
    }
    if (req.query.beginsWith) {
        query.name_lower = {
            $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`)
        }
    }
    if (req.query.page) {
        page = req.query.page;
    }
    if (req.query.timemin && req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(req.query.timemin));
        lesserThanTime = new Date(Number(req.query.timemax));
    }
    if (req.query.timemin && !req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(req.query.timemin));
        lesserThanTime = new Date(Number(+req.query.timemin + 604800000));      // Adding seven days worth of miliseconds
    }
    if (!req.query.timemin && req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(+req.query.timemax - 604800000));     // Subtracting seven days worth of miliseconds
        lesserThanTime = new Date(Number(req.query.timemax));
    }
    if (history) {
        getFactions(query, { greater: greaterThanTime, lesser: lesserThanTime }, page)
            .then(result => {
                (async (result) => {
                    try {
                        let resultPromise = [];
                        result.docs.forEach(faction => {
                            resultPromise.push(new Promise((resolve, reject) => {
                                let allSystems = [];
                                faction.faction_presence.forEach(system => {
                                    allSystems.push(system.system_name_lower);
                                });
                                faction.history.forEach(record => {
                                    if (allSystems.indexOf(record.system_lower) === -1) {
                                        allSystems.push(record.system_lower);
                                    }
                                });
                                ebgsSystemsV4Model
                                    .then(systems => {
                                        systems.find({
                                            name_lower: {
                                                "$in": allSystems
                                            }
                                        }).lean().then(gotSystems => {
                                            faction.faction_presence.forEach(system => {
                                                let index = gotSystems.findIndex(findSystem => {
                                                    return findSystem.name_lower === system.system_name_lower;
                                                });
                                                system.system_id = gotSystems[index]._id;
                                                system.controlling = faction.name_lower === gotSystems[index].controlling_minor_faction;
                                                system.population = gotSystems[index].population
                                            });
                                            faction.history.forEach(record => {
                                                let index = gotSystems.findIndex(findSystem => {
                                                    return findSystem.name_lower === record.system_lower;
                                                });
                                                record.system_id = gotSystems[index]._id;
                                            });
                                            resolve();
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    }).catch(err => {
                                        reject(err);
                                    });
                            }));
                        });
                        return Promise.resolve(await Promise.all(resultPromise));
                    } catch (err) {
                        return Promise.reject(err);
                    }
                })(result)
                    .then(() => {
                        res.status(200).json(result);
                    })
                    .catch(next);
            })
            .catch(next);
    } else {
        getFactions(query, {}, page)
            .then(result => {
                (async (result) => {
                    try {
                        let resultPromise = [];
                        result.docs.forEach(faction => {
                            resultPromise.push(new Promise((resolve, reject) => {
                                ebgsSystemsV4Model
                                    .then(systems => {
                                        systems.find({
                                            name_lower: {
                                                "$in": faction.faction_presence.map(system => {
                                                    return system.system_name_lower;
                                                })
                                            }
                                        }).lean().then(gotSystems => {
                                            faction.faction_presence.forEach(system => {
                                                let index = gotSystems.findIndex(findSystem => {
                                                    return findSystem.name_lower === system.system_name_lower;
                                                });
                                                system.system_id = gotSystems[index]._id;
                                            })
                                            resolve();
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    }).catch(err => {
                                        reject(err);
                                    });
                            }));
                        });
                        return Promise.resolve(await Promise.all(resultPromise));
                    } catch (err) {
                        return Promise.reject(err);
                    }
                })(result)
                    .then(() => {
                        res.status(200).json(result);
                    })
                    .catch(next);
            })
            .catch(next);
    }
});

router.get('/systems', (req, res, next) => {
    let query = new Object;
    let page = 1;
    let history = false;
    let greaterThanTime;
    let lesserThanTime;

    if (req.query.id) {
        query._id = req.query.id;
    }
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
    if (req.query.security) {
        query.security = req.query.security.toLowerCase();
    }
    if (req.query.beginsWith) {
        query.name_lower = {
            $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`)
        }
    }
    if (req.query.page) {
        page = req.query.page;
    }
    if (req.query.timemin && req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(req.query.timemin));
        lesserThanTime = new Date(Number(req.query.timemax));
    }
    if (req.query.timemin && !req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(req.query.timemin));
        lesserThanTime = new Date(Number(+req.query.timemin + 604800000));      // Adding seven days worth of miliseconds
    }
    if (!req.query.timemin && req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(+req.query.timemax - 604800000));     // Subtracting seven days worth of miliseconds
        lesserThanTime = new Date(Number(req.query.timemax));
    }
    if (history) {
        getSystems(query, { greater: greaterThanTime, lesser: lesserThanTime }, page)
            .then(result => {
                (async (result) => {
                    try {
                        let resultPromise = [];
                        result.docs.forEach(system => {
                            resultPromise.push(new Promise((resolve, reject) => {
                                let allFactions = [];
                                system.factions.forEach(faction => {
                                    allFactions.push(faction.name_lower);
                                });
                                system.history.forEach(record => {
                                    record.factions.forEach(faction => {
                                        if (allFactions.indexOf(faction.name_lower) === -1) {
                                            allFactions.push(faction.name_lower);
                                        }
                                    });
                                });
                                system.faction_history = [];
                                let factionPromise = ebgsFactionsV4Model
                                    .then(factions => {
                                        return factions.find(
                                            {
                                                name_lower: {
                                                    "$in": allFactions
                                                }
                                            },
                                            {
                                                _id: 1,
                                                eddb_id: 1,
                                                name: 1,
                                                name_lower: 1,
                                                updated_at: 1,
                                                government: 1,
                                                allegiance: 1,
                                                home_system_name: 1,
                                                is_player_faction: 1,
                                                faction_presence: {
                                                    $elemMatch: {
                                                        system_name_lower: system.name_lower
                                                    }
                                                }
                                            }).lean();
                                    })
                                    .catch(err => {
                                        return Promise.reject(err);
                                    })
                                let historyPromise = require('../models/ebgs_history_faction_v4')
                                    .then(records => {
                                        return records.find(
                                            {
                                                updated_at: {
                                                    $lte: lesserThanTime,
                                                    $gte: greaterThanTime
                                                },
                                                system_lower: system.name_lower
                                            }).lean();
                                    })
                                    .catch(err => {
                                        return Promise.reject(err);
                                    });
                                Promise.all([factionPromise, historyPromise])
                                    .then(factionHistoryResults => {
                                        let factionRecords = factionHistoryResults[0];
                                        let historyRecords = factionHistoryResults[1];
                                        system.factions.forEach(faction => {
                                            let index = factionRecords.findIndex(findFaction => {
                                                return findFaction.name_lower === faction.name_lower;
                                            });
                                            faction.faction_id = factionRecords[index]._id;
                                            faction.influence = factionRecords[index].faction_presence[0].influence;
                                            faction.state = factionRecords[index].faction_presence[0].state;
                                            faction.pending_states = factionRecords[index].faction_presence[0].pending_states;
                                            faction.recovering_states = factionRecords[index].faction_presence[0].recovering_states;
                                            faction.updated_at = factionRecords[index].faction_presence[0].updated_at;
                                        });
                                        system.history.forEach(record => {
                                            record.factions.forEach(faction => {
                                                let index = factionRecords.findIndex(findFaction => {
                                                    return findFaction.name_lower === faction.name_lower;
                                                });
                                                faction.faction_id = factionRecords[index]._id;
                                            });
                                        });
                                        system.faction_history = historyRecords;
                                        system.faction_history.forEach(record => {
                                            record.faction = record.faction_name_lower;
                                            delete record.faction_id;
                                            delete record.faction_name_lower;
                                        });
                                        resolve();
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            }));
                        });
                        return Promise.resolve(await Promise.all(resultPromise));
                    } catch (err) {
                        return Promise.reject(err);
                    }
                })(result)
                    .then(() => {
                        res.status(200).json(result);
                    })
                    .catch(next);
            })
            .catch(next);
    } else {
        getSystems(query, {}, page)
            .then(result => {
                (async (result) => {
                    try {
                        let resultPromise = [];
                        result.docs.forEach(system => {
                            resultPromise.push(new Promise((resolve, reject) => {
                                ebgsFactionsV4Model
                                    .then(factions => {
                                        factions.find({
                                            name_lower: {
                                                "$in": system.factions.map(faction => {
                                                    return faction.name_lower;
                                                })
                                            }
                                        }).then(gotFactions => {
                                            system.factions.forEach(faction => {
                                                let index = gotFactions.findIndex(findFaction => {
                                                    return findFaction.name_lower === faction.name_lower;
                                                });
                                                if (index !== -1) {
                                                    faction.faction_id = gotFactions[index]._id;
                                                } else {
                                                    faction.faction_id = 0;
                                                }
                                            })
                                            resolve();
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            }));
                        });
                        return Promise.resolve(await Promise.all(resultPromise));
                    } catch (err) {
                        return Promise.reject(err);
                    }
                })(result)
                    .then(() => {
                        res.status(200).json(result);
                    })
                    .catch(next);
            })
            .catch(next);
    }
});

router.get('/stations', (req, res, next) => {
    let query = new Object;
    let page = 1;
    let history = false;
    let greaterThanTime;
    let lesserThanTime;

    if (req.query.id) {
        query._id = req.query.id;
    }
    if (req.query.name) {
        query.name_lower = req.query.name.toLowerCase();
    }
    if (req.query.type) {
        query.type = req.query.type.toLowerCase();
    }
    if (req.query.system) {
        query.system_lower = req.query.system.toLowerCase();
    }
    if (req.query.economy) {
        query.economy = req.query.economy.toLowerCase();
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
    if (req.query.beginsWith) {
        query.name_lower = {
            $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`)
        }
    }
    if (req.query.page) {
        page = req.query.page;
    }
    if (req.query.timemin && req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(req.query.timemin));
        lesserThanTime = new Date(Number(req.query.timemax));
    }
    if (req.query.timemin && !req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(req.query.timemin));
        lesserThanTime = new Date(Number(+req.query.timemin + 604800000));      // Adding seven days worth of miliseconds
    }
    if (!req.query.timemin && req.query.timemax) {
        history = true;
        greaterThanTime = new Date(Number(+req.query.timemax - 604800000));     // Subtracting seven days worth of miliseconds
        lesserThanTime = new Date(Number(req.query.timemax));
    }
    if (history) {
        getStations(query, { greater: greaterThanTime, lesser: lesserThanTime }, page)
            .then(result => {
                res.status(200).json(result);
            })
            .catch(next);
    } else {
        getStations(query, {}, page)
            .then(result => {
                res.status(200).json(result);
            })
            .catch(next);
    }
});

let validateUser = user => {
    if (_.has(user, '_id')
        && _.has(user, 'username')
        && _.has(user, 'discriminator')
        && _.has(user, 'access')
    ) {
        if (user.factions) {
            user.factions.forEach(faction => {
                if (!_.has(faction, 'name')
                    || !_.has(faction, 'name_lower')
                    || faction.name.toLowerCase() !== faction.name_lower
                ) {
                    return false;
                }
            });
        }
        if (user.systems) {
            user.systems.forEach(system => {
                if (!_.has(system, 'name')
                    || !_.has(system, 'name_lower')
                    || system.name.toLowerCase() !== system.name_lower
                ) {
                    return false;
                }
            });
        }
        return true;
    } else {
        return false;
    }
}

async function getFactions(query, history, page) {
    let paginateOptions = {
        select: { history: 0 },
        lean: true,
        leanWithId: false,
        page: page,
        limit: 10
    };
    try {
        let factionModel = await ebgsFactionsV4Model;
        let factionResult = await factionModel.paginate(query, paginateOptions);
        if (!_.isEmpty(history)) {
            let historyModel = await require('../models/ebgs_history_faction_v4');
            let historyPromises = [];
            factionResult.docs.forEach(faction => {
                historyPromises.push(new Promise((resolve, reject) => {
                    historyModel.find({
                        faction_id: faction._id,
                        updated_at: {
                            $lte: history.lesser,
                            $gte: history.greater
                        }
                    }).lean().then(record => {
                        record.forEach(history => {
                            delete history.faction_id;
                            delete history.faction_name_lower;
                        });
                        faction.history = record;
                        resolve(record);
                    }).catch(err => {
                        reject(err);
                    });
                }));
            });
            await Promise.all(historyPromises);
        }
        return Promise.resolve(factionResult);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function getSystems(query, history, page) {
    let paginateOptions = {
        select: { history: 0 },
        lean: true,
        leanWithId: false,
        page: page,
        limit: 10
    };
    try {
        let systemModel = await ebgsSystemsV4Model;
        let systemResult = await systemModel.paginate(query, paginateOptions);
        if (!_.isEmpty(history)) {
            let historyModel = await require('../models/ebgs_history_system_v4');
            let historyPromises = [];
            systemResult.docs.forEach(system => {
                historyPromises.push(new Promise((resolve, reject) => {
                    historyModel.find({
                        system_id: system._id,
                        updated_at: {
                            $lte: history.lesser,
                            $gte: history.greater
                        }
                    }).lean().then(record => {
                        record.forEach(history => {
                            delete history.system_id;
                            delete history.system_name_lower;
                        });
                        system.history = record;
                        resolve(record);
                    }).catch(err => {
                        reject(err);
                    });
                }));
            });
            await Promise.all(historyPromises);
        }
        return Promise.resolve(systemResult);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function getStations(query, history, page) {
    let paginateOptions = {
        select: { history: 0 },
        lean: true,
        leanWithId: false,
        page: page,
        limit: 10
    };
    try {
        let stationModel = await require('../models/ebgs_stations_v4');
        let stationResult = await stationModel.paginate(query, paginateOptions);
        if (!_.isEmpty(history)) {
            let historyModel = await require('../models/ebgs_history_station_v4');
            let historyPromises = [];
            stationResult.docs.forEach(station => {
                historyPromises.push(new Promise((resolve, reject) => {
                    historyModel.find({
                        station_id: station._id,
                        updated_at: {
                            $lte: history.lesser,
                            $gte: history.greater
                        }
                    }).lean().then(record => {
                        record.forEach(history => {
                            delete history.station_id;
                            delete history.station_name_lower;
                        });
                        station.history = record;
                        resolve(record);
                    }).catch(err => {
                        reject(err);
                    });
                }));
            });
            await Promise.all(historyPromises);
        }
        return Promise.resolve(stationResult);
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = router;
