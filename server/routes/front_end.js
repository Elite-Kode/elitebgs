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

const ebgsFactionsV3Model = require('../models/ebgs_factions_v3');
const ebgsSystemsV3Model = require('../models/ebgs_systems_v3');

let router = express.Router();

router.get('/backgroundimages', (req, res, next) => {
    let pathToFile = path.resolve(__dirname, '../../src/assets/backgrounds');
    res.send(fs.readdirSync(pathToFile));
});

router.post('/edit', (req, res, next) => {
    console.log(req.body);
    if (validateEdit(req.body)) {
        ebgsSystemsV3Model
            .then(model => {
                model.findOne(
                    {
                        name_lower: req.body.name_lower,
                        x: correctCoordinates(req.body.x),
                        y: correctCoordinates(req.body.y),
                        z: correctCoordinates(req.body.z)
                    },
                    { history: 0 }
                ).lean().then(system => {
                    if (system) {
                        req.body.factions.forEach(faction => {
                            if (system.factions.findIndex(element => {
                                return element.name_lower === faction.name_lower;
                            }) === -1) {
                                res.send(false);
                                return;
                            }
                        });
                        let controllingFactionPromise = new Promise((resolve, reject) => {
                            req.body.factions.forEach(faction => {
                                if (faction.name_lower === req.body.controlling_minor_faction) {
                                    ebgsFactionsV3Model
                                        .then(model => {
                                            model.findOne(
                                                {
                                                    name_lower: req.body.controlling_minor_faction
                                                },
                                                { history: 0 }
                                            ).lean().then(factionGot => {
                                                if (factionGot) {
                                                    resolve([faction.state, factionGot]);
                                                } else {
                                                    reject();
                                                }
                                            }).catch(err => {
                                                reject(err);
                                            });
                                        }).catch(err => {
                                            reject(err);
                                        });
                                }
                            });
                        });
                        controllingFactionPromise
                            .then(data => {
                                let state = data[0];
                                let government = data[1].government;
                                let allegiance = data[1].allegiance;
                                let security = req.body.security;
                                state = ids.stateFDevArray[ids.stateIdsArray.indexOf(state)];
                                government = ids.governmentFDevArray[ids.governmentIdsArray.indexOf(titlify(government))];
                                allegiance = ids.allegianceFDevArray[ids.allegianceIdsArray.indexOf(titlify(allegiance))];
                                security = ids.securityFDevArray[ids.securityIdsArray.indexOf(security)];
                                let factions = [];
                                req.body.factions.forEach(faction => {
                                    factions.push({
                                        name: faction.name,
                                        name_lower: faction.name_lower
                                    });
                                });
                                if (system.population !== req.body.population ||
                                    system.security !== security ||
                                    system.state !== state ||
                                    system.government !== government ||
                                    system.allegiance !== allegiance ||
                                    system.controlling_minor_faction !== req.body.controlling_minor_faction.toLowerCase() ||
                                    !_.isEqual(_.sortBy(system.factions, ['name_lower']), _.sortBy(factions, ['name_lower']))) {
                                    let systemObject = {
                                        population: req.body.population,
                                        security: security,
                                        state: state,
                                        government: government,
                                        allegiance: allegiance,
                                        controlling_minor_faction: req.body.controlling_minor_faction.toLowerCase(),
                                        updated_at: req.body.updated_at,
                                        factions: factions
                                    };
                                    systemObject["$addToSet"] = {
                                        history: {
                                            population: req.body.population,
                                            security: security,
                                            state: state,
                                            government: government,
                                            allegiance: allegiance,
                                            controlling_minor_faction: req.body.controlling_minor_faction.toLowerCase(),
                                            updated_at: req.body.updated_at,
                                            factions: factions,
                                            updated_by: "Test"
                                        }
                                    }
                                    model.findOneAndUpdate(
                                        {
                                            name_lower: req.body.name_lower,
                                            x: correctCoordinates(req.body.x),
                                            y: correctCoordinates(req.body.y),
                                            z: correctCoordinates(req.body.z)
                                        },
                                        systemObject,
                                        {
                                            upsert: false,
                                            runValidators: true
                                        }).then(data => {
                                            factionUpdate();
                                        }).catch((err) => {
                                            console.log(err);
                                            res.send(false);
                                        });
                                } else {
                                    factionUpdate();
                                }
                            }).catch(err => {
                                console.log(err);
                                res.send(false);
                            });
                    } else {
                        res.send(false);
                    }
                }).catch(err => {
                    console.log(err);
                    res.send(false);
                });
            }).catch(err => {
                console.log(err);
                res.send(false);
            });

        function factionUpdate() {
            ebgsFactionsV3Model
                .then(model => {
                    let editFactionsLower = [];
                    req.body.factions.forEach(faction => {
                        editFactionsLower.push(faction.name_lower);
                    });

                    let allFactionsPresentInSystem = model.find(
                        {
                            faction_presence: {
                                $elemMatch: { system_name_lower: req.body.name_lower }
                            }
                        },
                        { history: 0 }
                    ).lean();

                    let allFactionsPresentInEdit = model.find(
                        {
                            name_lower: {
                                $in: editFactionsLower
                            }
                        },
                        { history: 0 }
                    ).lean();

                    Promise.all([allFactionsPresentInSystem, allFactionsPresentInEdit])
                        .then(values => {
                            let factionsPresentInSystemDB = values[0];
                            let factionsAllDetails = values[1];

                            let factionsNotInSystem = [];

                            factionsPresentInSystemDB.forEach(faction => {
                                factionsNotInSystem.push(faction.name_lower);
                            });

                            let toRemove = _.difference(factionsNotInSystem, editFactionsLower);

                            let dbFactionsLower = [];

                            factionsAllDetails.forEach(faction => {
                                dbFactionsLower.push(faction.name_lower);
                            });
                            // To remove are those factions which are not present in this system anymore
                            // Such factions need to be updated too
                            let toRemovePromise = [];
                            toRemove.forEach(factionNameLower => {
                                factionsPresentInSystemDB.forEach(faction => {
                                    if (factionNameLower === faction.name_lower && faction.updated_at < new Date(req.body.updated_at)) {
                                        let factionPresence = [];
                                        faction.faction_presence.forEach(system => {
                                            if (system.system_name_lower !== req.body.name_lower) {
                                                factionPresence.push(system);
                                            }
                                        });
                                        faction.faction_presence = factionPresence;
                                        faction.updated_at = new Date(req.body.updated_at);
                                        toRemovePromise.push(new Promise((resolve, reject) => {
                                            model.findOneAndUpdate(
                                                {
                                                    name: faction.name
                                                },
                                                faction,
                                                {
                                                    upsert: false,
                                                    runValidators: true
                                                })
                                                .then(data => {
                                                    resolve(true);
                                                })
                                                .catch(err => {
                                                    resolve(false);
                                                });
                                        }));
                                    }
                                })
                            });
                            // dbFactionsLower are the factions present in the db. So next we need to update them
                            // factionsAllDetails has all the factions details
                            let factionsAllDetailsPromise = [];
                            factionsAllDetails.forEach(dbFaction => {
                                req.body.factions.forEach(editFaction => {
                                    if (editFaction.name_lower === dbFaction.name_lower && dbFaction.updated_at < new Date(req.body.updated_at)) {
                                        editFaction.state = ids.stateFDevArray[ids.stateIdsArray.indexOf(editFaction.state)]
                                        let pendingStates = [];
                                        if (editFaction.pending_states) {
                                            editFaction.pending_states.forEach(pendingState => {
                                                let pendingStateObject = {
                                                    state: pendingState.state.toLowerCase(),
                                                    trend: pendingState.trend
                                                };
                                                pendingStates.push(pendingStateObject);
                                            });
                                        };
                                        let recoveringStates = [];
                                        if (editFaction.recovering_states) {
                                            editFaction.recovering_states.forEach(recoveringState => {
                                                let recoveringStateObject = {
                                                    state: recoveringState.state.toLowerCase(),
                                                    trend: recoveringState.trend
                                                };
                                                recoveringStates.push(recoveringStateObject);
                                            });
                                        };

                                        // Check if the incoming message has any different faction detail
                                        let doUpdate = true;
                                        dbFaction.faction_presence.forEach(faction => {
                                            if (faction.system_name_lower === req.body.name_lower &&
                                                faction.state === editFaction.state &&
                                                faction.influence === editFaction.influence &&
                                                _.isEqual(_.sortBy(faction.pending_states, ['state']), _.sortBy(pendingStates, ['state'])) &&
                                                _.isEqual(_.sortBy(faction.recovering_states, ['state']), _.sortBy(recoveringStates, ['state']))) {
                                                doUpdate = false;
                                            }
                                        })
                                        if (doUpdate) {
                                            let factionPresentSystemObject = {};
                                            let factionPresence = dbFaction.faction_presence;

                                            factionPresence.forEach((factionPresenceObject, index, factionPresenceArray) => {
                                                if (factionPresenceObject.system_name_lower === req.body.name_lower) {
                                                    factionPresentSystemObject = {
                                                        system_name: req.body.name,
                                                        system_name_lower: req.body.name_lower,
                                                        state: editFaction.state,
                                                        influence: editFaction.influence,
                                                        pending_states: pendingStates,
                                                        recovering_states: recoveringStates
                                                    };
                                                    factionPresenceArray[index] = factionPresentSystemObject;
                                                }
                                            });

                                            if (_.isEmpty(factionPresentSystemObject)) {
                                                // This system is not present as a presence system in db.
                                                // Make a new array element
                                                factionPresence.push({
                                                    system_name: req.body.name,
                                                    system_name_lower: req.body.name_lower,
                                                    state: editFaction.state,
                                                    influence: editFaction.influence,
                                                    pending_states: pendingStates,
                                                    recovering_states: recoveringStates
                                                });
                                            }

                                            let systemHistory = [];

                                            factionPresence.forEach((faction) => {
                                                systemHistory.push({
                                                    name: faction.system_name,
                                                    name_lower: faction.system_name_lower
                                                });
                                            });

                                            let factionObject = {
                                                updated_at: req.body.updated_at,
                                                faction_presence: factionPresence,
                                                $addToSet: {
                                                    history: {
                                                        updated_at: req.body.updated_at,
                                                        updated_by: "Test",
                                                        system: req.body.name,
                                                        system_lower: req.body.name_lower,
                                                        state: editFaction.state,
                                                        influence: editFaction.influence,
                                                        pending_states: pendingStates,
                                                        recovering_states: recoveringStates,
                                                        systems: systemHistory
                                                    }
                                                }
                                            };
                                            factionsAllDetailsPromise.push(new Promise((resolve, reject) => {
                                                model.findOneAndUpdate(
                                                    {
                                                        name: editFaction.name
                                                    },
                                                    factionObject,
                                                    {
                                                        upsert: false,
                                                        runValidators: true
                                                    })
                                                    .then(data => {
                                                        resolve(true);
                                                    })
                                                    .catch(err => {
                                                        resolve(false);
                                                    });
                                            }));
                                        } else {
                                            factionsAllDetailsPromise.push(Promise.resolve(true));
                                        }
                                    }
                                })
                            });
                            Promise.all(toRemovePromise.concat(factionsAllDetailsPromise))
                                .then(allPromises => {
                                    allPromises.forEach(bool => {
                                        if (!bool) {
                                            res.send(false);
                                        }
                                    });
                                    res.send(true);
                                });
                        }).catch(err => {
                            console.log(err);
                            res.send(false);
                        });
                }).catch(err => {
                    console.log(err);
                    res.send(false);
                });
        }
    } else {
        res.send(false);
    }
});

let validateEdit = data => {
    let valid = true;
    if (_.has(data, '_id')
        && _.has(data, 'name')
        && _.has(data, 'name_lower')
        && _.has(data, 'x')
        && _.has(data, 'y')
        && _.has(data, 'z')
        && _.has(data, 'population')
        && _.has(data, 'security')
        && _.has(data, 'controlling_minor_faction')
        && _.has(data, 'updated_at')
        && _.has(data, 'factions')
        && data.name.toLowerCase() === data.name_lower) {
        if (ids.securityIdsArray.indexOf(data.security) === -1) {
            return false;
        }
        if (data.factions.findIndex(element => {
            if (_.has(element, 'name_lower')) {
                return element.name_lower === data.controlling_minor_faction;
            }
        }) === -1) {
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
                    if (ids.stateIdsArray.indexOf(faction.state) === -1) {
                        valid = false;
                        return;
                    }
                    faction.pending_states.forEach(state => {
                        if (state) {
                            if (_.has(state, 'state')
                                && _.has(state, 'trend')) {
                                if (ids.stateIdsArray.indexOf(state.state) === -1) {
                                    valid = false;
                                    return;
                                }
                                if (state.trend !== -1 && state.trend !== 0 && state.trend !== 1) {
                                    valid = false;
                                    return;
                                }
                            } else {
                                valid = false;
                                return;
                            }
                        }
                    });
                    faction.recovering_states.forEach(state => {
                        if (state) {
                            if (_.has(state, 'state')
                                && _.has(state, 'trend')) {
                                if (ids.stateIdsArray.indexOf(state.state) === -1) {
                                    valid = false;
                                    return;
                                }
                                if (state.trend !== -1 && state.trend !== 0 && state.trend !== 1) {
                                    valid = false;
                                    return;
                                }
                            } else {
                                valid = false;
                                return;
                            }
                        }
                    });
                    if (!valid) {
                        return;
                    }
                    totalInfluence += faction.influence;
                } else {
                    valid = false;
                    return;
                }
            } else {
                valid = false;
                return;
            }
        });
        if (totalInfluence !== 1) {
            return false;
        }
        return valid;
    } else {
        return false;
    }
}

let titlify = title => {
    let revised = title.charAt(0).toUpperCase();
    for (let i = 1; i < title.length; i++) {
        if (title.charAt(i - 1) === ' ') {
            revised += title.charAt(i).toUpperCase();
        } else {
            revised += title.charAt(i).toLowerCase();
        }
    }
    return revised;
}

let correctCoordinates = value => {
    let floatValue = Number.parseFloat(value);
    let intValue = Math.round(floatValue * 32);
    return intValue / 32;
}

module.exports = router;
