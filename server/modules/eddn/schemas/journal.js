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

const _ = require('lodash');
const request = require('request');

const ebgsFactionsModel = require('../../../models/ebgs_factions');
const ebgsSystemsModel = require('../../../models/ebgs_systems');
const ebgsFactionsV3Model = require('../../../models/ebgs_factions_v3');
const ebgsSystemsV3Model = require('../../../models/ebgs_systems_v3');
const ebgsStationsV3Model = require('../../../models/ebgs_stations_v3');

module.exports = Journal;

function Journal() {
    this.schemaId = [
        // "http://schemas.elite-markets.net/eddn/journal/1",
        // "https://eddn.edcd.io/schemas/journal/1"
        "https://eddn.edcd.io/schemas/journal/1/test"
    ];

    this.trackSystem = function (message) {
        if (message.event === "FSDJump" || message.event === "Location") {
            if (message.Factions) {
                let systemObject = {
                    name: message.StarSystem,
                    name_lower: message.StarSystem.toLowerCase(),
                    x: message.StarPos[0],
                    y: message.StarPos[1],
                    z: message.StarPos[2],
                    government: message.SystemGovernment,
                    allegiance: message.SystemAllegiance,
                    state: message.FactionState,
                    security: message.SystemSecurity,
                    primary_economy: message.SystemEconomy,
                    updated_at: message.timestamp,
                    controlling_minor_faction: message.SystemFaction
                };

                if (message.Powers) {
                    systemObject.power = [];
                    message.Powers.forEach((power) => {
                        systemObject.power.push(power.toLowerCase());
                    });
                    systemObject.power_state = message.PowerplayState;
                }

                let factionArray = [];

                message.Factions.forEach((faction) => {
                    factionArray.push({
                        name: faction.Name,
                        name_lower: faction.Name.toLowerCase()
                    });

                    let historySubObject = {
                        updated_at: message.timestamp,
                        system: message.StarSystem,
                        system_lower: message.StarSystem.toLowerCase(),
                        state: faction.FactionState,
                        influence: faction.Influence
                    }

                    historySubObject.pending_states = [];
                    if (faction.PendingStates) {
                        faction.PendingStates.forEach(pendingState => {
                            let pendingStateObject = {
                                state: pendingState.State,
                                trend: pendingState.Trend
                            };
                            historySubObject.pending_states.push(pendingStateObject);
                        });
                    }
                    historySubObject.recovering_states = [];
                    if (faction.RecoveringStates) {
                        faction.RecoveringStates.forEach(recoveringState => {
                            let recoveringStateObject = {
                                state: recoveringState.State,
                                trend: recoveringState.Trend
                            };
                            historySubObject.recovering_states.push(recoveringStateObject);
                        });
                    };

                    let factionObject = {
                        name: faction.Name,
                        name_lower: faction.Name.toLowerCase(),
                        updated_at: message.timestamp,
                        government: faction.Government,
                        allegiance: faction.Allegiance,
                        $addToSet: {
                            faction_presence: {
                                system_name: message.StarSystem,
                                system_name_lower: message.StarSystem.toLowerCase()
                            },
                            history: historySubObject
                        }
                    };

                    ebgsFactionsModel
                        .then(model => {
                            model.findOneAndUpdate(
                                { name: faction.Name },
                                factionObject,
                                {
                                    upsert: true,
                                    runValidators: true
                                })
                                .exec()
                                .catch((err) => {
                                    console.log(err);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
                systemObject.minor_faction_presences = factionArray;
                ebgsSystemsModel
                    .then(model => {
                        model.findOneAndUpdate(
                            { name: systemObject.name },
                            systemObject,
                            {
                                upsert: true,
                                runValidators: true
                            })
                            .exec()
                            .catch((err) => {
                                console.log(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }

    this.trackSystemV3 = function (message) {
        if (message.event === "FSDJump" || message.event === "Location") {
            if (message.Factions) {
                ebgsSystemsV3Model
                    .then(model => {
                        model.findOne(
                            {
                                name_lower: message.StarSystem.toLowerCase(),
                                x: this.correctCoordinates(message.StarPos[0]),
                                y: this.correctCoordinates(message.StarPos[1]),
                                z: this.correctCoordinates(message.StarPos[2])
                            },
                            { history: 0 }
                        ).lean().then(system => {
                            let hasEddbId = false;
                            let systemObject = {};
                            let historySubObject = {};
                            let eddbIdPromise;
                            let factionArray = [];
                            message.Factions.forEach(faction => {
                                let factionObject = {
                                    name: faction.Name,
                                    name_lower: faction.Name.toLowerCase()
                                };
                                factionArray.push(factionObject);
                            });
                            if (system) {   // System exists in db
                                if (!system.eddb_id) {
                                    eddbIdPromise = this.getEDDBId(message.StarSystem);
                                } else {
                                    systemObject.eddb_id = system.eddb_id;
                                    hasEddbId = true;
                                }
                                if (system.government !== message.SystemGovernment.toLowerCase() ||
                                    system.allegiance !== message.SystemAllegiance.toLowerCase() ||
                                    system.state !== message.FactionState.toLowerCase() ||
                                    system.security !== message.SystemSecurity.toLowerCase() ||
                                    system.controlling_minor_faction !== message.SystemFaction.toLowerCase() ||
                                    !_.isEqual(_.sortBy(system.factions, ['name_lower']), _.sortBy(factionArray, ['name_lower']))) {

                                    systemObject.government = message.SystemGovernment;
                                    systemObject.allegiance = message.SystemAllegiance;
                                    systemObject.state = message.FactionState;
                                    systemObject.security = message.SystemSecurity;
                                    systemObject.controlling_minor_faction = message.SystemFaction;
                                    systemObject.factions = factionArray;
                                    systemObject.updated_at = message.timestamp;

                                    historySubObject.updated_at = message.timestamp;
                                    historySubObject.government = message.SystemGovernment;
                                    historySubObject.allegiance = message.SystemAllegiance;
                                    historySubObject.state = message.FactionState;
                                    historySubObject.security = message.SystemSecurity;
                                    historySubObject.controlling_minor_faction = message.SystemFaction;
                                    historySubObject.factions = factionArray;
                                } else {
                                    systemObject.updated_at = message.timestamp;
                                }
                            } else {
                                eddbIdPromise = this.getEDDBId(message.StarSystem);
                                systemObject = {
                                    name: message.StarSystem,
                                    name_lower: message.StarSystem.toLowerCase(),
                                    x: message.StarPos[0],
                                    y: message.StarPos[1],
                                    z: message.StarPos[2],
                                    government: message.SystemGovernment,
                                    allegiance: message.SystemAllegiance,
                                    state: message.FactionState,
                                    security: message.SystemSecurity,
                                    controlling_minor_faction: message.SystemFaction,
                                    factions: factionArray,
                                    updated_at: message.timestamp
                                };

                                historySubObject = {
                                    updated_at: message.timestamp,
                                    government: message.SystemGovernment,
                                    allegiance: message.SystemAllegiance,
                                    state: message.FactionState,
                                    security: message.SystemSecurity,
                                    controlling_minor_faction: message.SystemFaction,
                                    factions: factionArray
                                };
                            }
                            if (!_.isEmpty(historySubObject)) {
                                systemObject["$addToSet"] = {
                                    history: historySubObject
                                }
                            }
                            if (!_.isEmpty(systemObject)) {
                                if (hasEddbId) {
                                    model.findOneAndUpdate(
                                        {
                                            name_lower: message.StarSystem.toLowerCase(),
                                            x: this.correctCoordinates(message.StarPos[0]),
                                            y: this.correctCoordinates(message.StarPos[1]),
                                            z: this.correctCoordinates(message.StarPos[2])
                                        },
                                        systemObject,
                                        {
                                            upsert: true,
                                            runValidators: true
                                        })
                                        .exec()
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                } else {
                                    eddbIdPromise.then(id => {
                                        systemObject.eddb_id = id;
                                        model.findOneAndUpdate(
                                            {
                                                name_lower: message.StarSystem.toLowerCase(),
                                                x: this.correctCoordinates(message.StarPos[0]),
                                                y: this.correctCoordinates(message.StarPos[1]),
                                                z: this.correctCoordinates(message.StarPos[2])
                                            },
                                            systemObject,
                                            {
                                                upsert: true,
                                                runValidators: true
                                            })
                                            .exec()
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    })
                                }
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
                // ebgsFactionsV3Model
                //     .then(model => {

                //     })
            }
        }
    }

    this.correctCoordinates = function (value) {
        let floatValue = Number.parseFloat(value);
        let intValue = Number.parseInt((floatValue * 32).toString().split('.')[0]);
        return intValue / 32;
    }

    this.getEDDBId = function (name) {
        return new Promise((resolve, reject) => {
            let requestOptions = {
                url: "http://elitebgs.kodeblox.com/api/eddb/v1/populatedsystems",
                method: "GET",
                auth: {
                    'user': 'guest',
                    'pass': 'secret',
                    'sendImmediately': true
                },
                qs: {
                    name: name.toLowerCase()
                }
            };
            request(requestOptions, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let responseData = body;
                    if (responseData.length !== 2) {
                        let responseObject = JSON.parse(responseData);
                        resolve(responseObject[0].id);
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }
            });
        })
    }
}
