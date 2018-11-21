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
const semver = require('semver');
const moment = require('moment');

const ebgsFactionsModel = require('../../../models/ebgs_factions');
const ebgsSystemsModel = require('../../../models/ebgs_systems');

const ebgsFactionsV3Model = require('../../../models/ebgs_factions_v3');
const ebgsSystemsV3Model = require('../../../models/ebgs_systems_v3');

const ebgsFactionsV4Model = require('../../../models/ebgs_factions_v4');
const ebgsSystemsV4Model = require('../../../models/ebgs_systems_v4');
const ebgsStationsV4Model = require('../../../models/ebgs_stations_v4');
const ebgsHistoryFactionV4Model = require('../../../models/ebgs_history_faction_v4');
const ebgsHistorySystemV4Model = require('../../../models/ebgs_history_system_v4');
const ebgsHistoryStationV4Model = require('../../../models/ebgs_history_station_v4');

const configModel = require('../../../models/configs');

module.exports = Journal;

function Journal() {
    this.schemaId = [
        // "http://schemas.elite-markets.net/eddn/journal/1",
        "https://eddn.edcd.io/schemas/journal/1"
        // "https://eddn.edcd.io/schemas/journal/1/test"
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
            if (message.Factions && this.checkMessage(message)) {
                let notNeededFactionIndex = message.Factions.findIndex(faction => {
                    return faction.Name === "Pilots Federation Local Branch";
                });
                if (notNeededFactionIndex !== -1) {
                    message.Factions.splice(notNeededFactionIndex, 1);
                }
                let factionArray = [];
                message.Factions.forEach(faction => {
                    let factionObject = {
                        name: faction.Name,
                        name_lower: faction.Name.toLowerCase()
                    };
                    factionArray.push(factionObject);
                });
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
                            if (system) {   // System exists in db
                                if (system.updated_at < new Date(message.timestamp)) {
                                    if (!system.eddb_id) {
                                        eddbIdPromise = this.getSystemEDDBId(message.StarSystem);
                                    } else {
                                        systemObject.eddb_id = system.eddb_id;
                                        hasEddbId = true;
                                    }
                                    if (system.government !== message.SystemGovernment.toLowerCase() ||
                                        system.allegiance !== message.SystemAllegiance.toLowerCase() ||
                                        system.state !== message.FactionState.toLowerCase() ||
                                        system.security !== message.SystemSecurity.toLowerCase() ||
                                        system.population !== message.Population ||
                                        system.controlling_minor_faction !== message.SystemFaction.toLowerCase() ||
                                        !_.isEqual(_.sortBy(system.factions, ['name_lower']), _.sortBy(factionArray, ['name_lower']))) {

                                        systemObject.government = message.SystemGovernment;
                                        systemObject.allegiance = message.SystemAllegiance;
                                        systemObject.state = message.FactionState;
                                        systemObject.security = message.SystemSecurity;
                                        systemObject.population = message.Population;
                                        systemObject.controlling_minor_faction = message.SystemFaction;
                                        systemObject.factions = factionArray;
                                        systemObject.updated_at = message.timestamp;

                                        historySubObject.updated_at = message.timestamp;
                                        historySubObject.updated_by = "EDDN";
                                        historySubObject.government = message.SystemGovernment;
                                        historySubObject.allegiance = message.SystemAllegiance;
                                        historySubObject.state = message.FactionState;
                                        historySubObject.security = message.SystemSecurity;
                                        historySubObject.population = message.Population;
                                        historySubObject.controlling_minor_faction = message.SystemFaction;
                                        historySubObject.factions = factionArray;
                                    } else {
                                        systemObject.updated_at = message.timestamp;
                                    }
                                }
                            } else {
                                eddbIdPromise = this.getSystemEDDBId(message.StarSystem);
                                systemObject = {
                                    name: message.StarSystem,
                                    name_lower: message.StarSystem.toLowerCase(),
                                    x: this.correctCoordinates(message.StarPos[0]),
                                    y: this.correctCoordinates(message.StarPos[1]),
                                    z: this.correctCoordinates(message.StarPos[2]),
                                    government: message.SystemGovernment,
                                    allegiance: message.SystemAllegiance,
                                    state: message.FactionState,
                                    security: message.SystemSecurity,
                                    population: message.Population,
                                    primary_economy: message.SystemEconomy,
                                    controlling_minor_faction: message.SystemFaction,
                                    factions: factionArray,
                                    updated_at: message.timestamp
                                };

                                historySubObject = {
                                    updated_at: message.timestamp,
                                    updated_by: "EDDN",
                                    government: message.SystemGovernment,
                                    allegiance: message.SystemAllegiance,
                                    state: message.FactionState,
                                    security: message.SystemSecurity,
                                    population: message.Population,
                                    controlling_minor_faction: message.SystemFaction,
                                    factions: factionArray
                                };
                            }
                            if (!_.isEmpty(systemObject)) {
                                if (!_.isEmpty(historySubObject)) {
                                    systemObject["$addToSet"] = {
                                        history: historySubObject
                                    }
                                }
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
                                    eddbIdPromise
                                        .then(id => {
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
                                        .catch(() => {      // If eddb id cannot be fetched, create the record without it.
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
                ebgsFactionsV3Model
                    .then(model => {
                        let messageFactionsLower = [];
                        message.Factions.forEach(faction => {
                            messageFactionsLower.push(faction.Name.toLowerCase());
                        });

                        let allFactionsPresentInSystem = model.find(
                            {
                                faction_presence: {
                                    $elemMatch: { system_name_lower: message.StarSystem.toLowerCase() }
                                }
                            },
                            { history: 0 }
                        ).lean();

                        let allFactionsPresentInMessage = model.find(
                            {
                                name_lower: {
                                    $in: messageFactionsLower
                                }
                            },
                            { history: 0 }
                        ).lean();

                        Promise.all([allFactionsPresentInSystem, allFactionsPresentInMessage])
                            .then(values => {
                                let factionsPresentInSystemDB = values[0];
                                let factionsAllDetails = values[1];

                                let factionsNotInSystem = [];

                                factionsPresentInSystemDB.forEach(faction => {
                                    factionsNotInSystem.push(faction.name_lower);
                                });

                                let toRemove = _.difference(factionsNotInSystem, messageFactionsLower);

                                let dbFactionsLower = [];

                                factionsAllDetails.forEach(faction => {
                                    dbFactionsLower.push(faction.name_lower);
                                });
                                let notInDb = _.difference(messageFactionsLower, dbFactionsLower);
                                // To remove are those factions which are not present in this system anymore
                                // Such factions need to be updated too
                                toRemove.forEach(factionNameLower => {
                                    factionsPresentInSystemDB.forEach(faction => {
                                        if (factionNameLower === faction.name_lower && faction.updated_at < new Date(message.timestamp)) {
                                            let factionPresence = [];
                                            faction.faction_presence.forEach(system => {
                                                if (system.system_name_lower !== message.StarSystem.toLowerCase()) {
                                                    factionPresence.push(system);
                                                }
                                            });
                                            faction.faction_presence = factionPresence;
                                            faction.updated_at = message.timestamp;

                                            if (!faction.eddb_id) {
                                                this.getFactionEDDBId(faction.name)
                                                    .then(id => {
                                                        faction.eddb_id = id;
                                                        model.findOneAndUpdate(
                                                            {
                                                                name: faction.name
                                                            },
                                                            faction,
                                                            {
                                                                upsert: true,
                                                                runValidators: true
                                                            })
                                                            .exec()
                                                            .catch(err => {
                                                                console.log(err);
                                                            })
                                                    })
                                                    .catch(() => {
                                                        model.findOneAndUpdate(
                                                            {
                                                                name: faction.name
                                                            },
                                                            faction,
                                                            {
                                                                upsert: true,
                                                                runValidators: true
                                                            })
                                                            .exec()
                                                            .catch(err => {
                                                                console.log(err);
                                                            })
                                                    })
                                            } else {
                                                model.findOneAndUpdate(
                                                    {
                                                        name: faction.name
                                                    },
                                                    faction,
                                                    {
                                                        upsert: true,
                                                        runValidators: true
                                                    })
                                                    .exec()
                                                    .catch(err => {
                                                        console.log(err);
                                                    })
                                            }
                                        }
                                    })
                                })
                                // Not In DB means that the message contains a faction which is not present in the db yet
                                // So one must create a new record
                                notInDb.forEach(factionNameLower => {
                                    message.Factions.forEach(messageFaction => {
                                        if (messageFaction.Name.toLowerCase() === factionNameLower) {
                                            let pendingStates = [];
                                            if (messageFaction.PendingStates) {
                                                messageFaction.PendingStates.forEach(pendingState => {
                                                    let pendingStateObject = {
                                                        state: pendingState.State.toLowerCase(),
                                                        trend: pendingState.Trend
                                                    };
                                                    pendingStates.push(pendingStateObject);
                                                });
                                            };
                                            let recoveringStates = [];
                                            if (messageFaction.RecoveringStates) {
                                                messageFaction.RecoveringStates.forEach(recoveringState => {
                                                    let recoveringStateObject = {
                                                        state: recoveringState.State.toLowerCase(),
                                                        trend: recoveringState.Trend
                                                    };
                                                    recoveringStates.push(recoveringStateObject);
                                                });
                                            };

                                            let factionObject = {
                                                name: messageFaction.Name,
                                                name_lower: messageFaction.Name.toLowerCase(),
                                                updated_at: message.timestamp,
                                                government: messageFaction.Government,
                                                allegiance: messageFaction.Allegiance,
                                                faction_presence: [{
                                                    system_name: message.StarSystem,
                                                    system_name_lower: message.StarSystem.toLowerCase(),
                                                    state: messageFaction.FactionState,
                                                    influence: messageFaction.Influence,
                                                    pending_states: pendingStates,
                                                    recovering_states: recoveringStates
                                                }],
                                                history: [{
                                                    updated_at: message.timestamp,
                                                    updated_by: "EDDN",
                                                    system: message.StarSystem,
                                                    system_lower: message.StarSystem.toLowerCase(),
                                                    state: messageFaction.FactionState,
                                                    influence: messageFaction.Influence,
                                                    pending_states: pendingStates,
                                                    recovering_states: recoveringStates,
                                                    systems: [{
                                                        name: message.StarSystem,
                                                        name_lower: message.StarSystem.toLowerCase()
                                                    }]
                                                }]
                                            };
                                            this.getFactionEDDBId(messageFaction.Name)
                                                .then(id => {
                                                    model.findOneAndUpdate(
                                                        {
                                                            name: factionObject.name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true
                                                        })
                                                        .exec()
                                                        .catch(err => {
                                                            console.log(err);
                                                        })
                                                })
                                                .catch(() => {
                                                    model.findOneAndUpdate(
                                                        {
                                                            name: factionObject.name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true
                                                        })
                                                        .exec()
                                                        .catch(err => {
                                                            console.log(err);
                                                        })
                                                })
                                        }
                                    })
                                })
                                // dbFactionsLower are the factions present in the db. So next we need to update them
                                // factionsAllDetails has all the factions details
                                factionsAllDetails.forEach(dbFaction => {
                                    message.Factions.forEach(messageFaction => {
                                        if (messageFaction.Name.toLowerCase() === dbFaction.name_lower && dbFaction.updated_at < new Date(message.timestamp)) {
                                            let pendingStates = [];
                                            if (messageFaction.PendingStates) {
                                                messageFaction.PendingStates.forEach(pendingState => {
                                                    let pendingStateObject = {
                                                        state: pendingState.State.toLowerCase(),
                                                        trend: pendingState.Trend
                                                    };
                                                    pendingStates.push(pendingStateObject);
                                                });
                                            };
                                            let recoveringStates = [];
                                            if (messageFaction.RecoveringStates) {
                                                messageFaction.RecoveringStates.forEach(recoveringState => {
                                                    let recoveringStateObject = {
                                                        state: recoveringState.State.toLowerCase(),
                                                        trend: recoveringState.Trend
                                                    };
                                                    recoveringStates.push(recoveringStateObject);
                                                });
                                            };

                                            // Check if the incoming message has any different faction detail
                                            let doUpdate = true;
                                            dbFaction.faction_presence.forEach(faction => {
                                                if (faction.system_name_lower === message.StarSystem.toLowerCase() &&
                                                    faction.state === messageFaction.FactionState.toLowerCase() &&
                                                    faction.influence === messageFaction.Influence &&
                                                    _.isEqual(_.sortBy(faction.pending_states, ['state']), _.sortBy(pendingStates, ['state'])) &&
                                                    _.isEqual(_.sortBy(faction.recovering_states, ['state']), _.sortBy(recoveringStates, ['state']))) {
                                                    doUpdate = false;
                                                }
                                            })
                                            if (doUpdate) {
                                                let factionPresentSystemObject = {};
                                                let factionPresence = dbFaction.faction_presence;

                                                factionPresence.forEach((factionPresenceObject, index, factionPresenceArray) => {
                                                    if (factionPresenceObject.system_name_lower === message.StarSystem.toLowerCase()) {
                                                        factionPresentSystemObject = {
                                                            system_name: message.StarSystem,
                                                            system_name_lower: message.StarSystem.toLowerCase(),
                                                            state: messageFaction.FactionState,
                                                            influence: messageFaction.Influence,
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
                                                        system_name: message.StarSystem,
                                                        system_name_lower: message.StarSystem.toLowerCase(),
                                                        state: messageFaction.FactionState,
                                                        influence: messageFaction.Influence,
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
                                                    name: messageFaction.Name,
                                                    name_lower: messageFaction.Name.toLowerCase(),
                                                    updated_at: message.timestamp,
                                                    government: messageFaction.Government,
                                                    allegiance: messageFaction.Allegiance,
                                                    faction_presence: factionPresence,
                                                    $addToSet: {
                                                        history: {
                                                            updated_at: message.timestamp,
                                                            updated_by: "EDDN",
                                                            system: message.StarSystem,
                                                            system_lower: message.StarSystem.toLowerCase(),
                                                            state: messageFaction.FactionState,
                                                            influence: messageFaction.Influence,
                                                            pending_states: pendingStates,
                                                            recovering_states: recoveringStates,
                                                            systems: systemHistory
                                                        }
                                                    }
                                                };
                                                if (!dbFaction.eddb_id) {
                                                    this.getFactionEDDBId(messageFaction.Name)
                                                        .then(id => {
                                                            factionObject.eddb_id = id;
                                                            model.findOneAndUpdate(
                                                                {
                                                                    name: messageFaction.Name
                                                                },
                                                                factionObject,
                                                                {
                                                                    upsert: true,
                                                                    runValidators: true
                                                                })
                                                                .exec()
                                                                .catch(err => {
                                                                    console.log(err);
                                                                })
                                                        })
                                                        .catch(() => {
                                                            model.findOneAndUpdate(
                                                                {
                                                                    name: messageFaction.Name
                                                                },
                                                                factionObject,
                                                                {
                                                                    upsert: true,
                                                                    runValidators: true
                                                                })
                                                                .exec()
                                                                .catch(err => {
                                                                    console.log(err);
                                                                })
                                                        })
                                                } else {
                                                    model.findOneAndUpdate(
                                                        {
                                                            name: messageFaction.Name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true
                                                        })
                                                        .exec()
                                                        .catch(err => {
                                                            console.log(err);
                                                        })
                                                }
                                            }
                                        }
                                    })
                                })
                            })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }

    this.trackSystemV4 = async function (message, header) {
        if (message.event === "FSDJump" || message.event === "Location") {
            try {
                await this.checkMessage1(message, header);
                let notNeededFactionIndex = message.Factions.findIndex(faction => {
                    return faction.Name === "Pilots Federation Local Branch"; // Todo: Add engineers
                });
                if (notNeededFactionIndex !== -1) {
                    message.Factions.splice(notNeededFactionIndex, 1);
                }
                let factionArray = [];
                message.Factions.forEach(faction => {
                    let factionObject = {
                        name: faction.Name,
                        name_lower: faction.Name.toLowerCase()
                    };
                    factionArray.push(factionObject);
                });
                ebgsSystemsV4Model
                    .then(async (model) => {
                        let system = await model.findOne(
                            {
                                name_lower: message.StarSystem.toLowerCase(),
                                x: this.correctCoordinates(message.StarPos[0]),
                                y: this.correctCoordinates(message.StarPos[1]),
                                z: this.correctCoordinates(message.StarPos[2])
                            }
                        ).lean();
                        let hasEddbId = false;
                        let systemObject = {};
                        let historyObject = {};
                        let eddbIdPromise;
                        if (system) {   // System exists in db
                            if (system.updated_at < new Date(message.timestamp)) {
                                if (!system.eddb_id) {
                                    eddbIdPromise = this.getSystemEDDBId(message.StarSystem);
                                } else {
                                    systemObject.eddb_id = system.eddb_id;
                                    hasEddbId = true;
                                }
                                if (system.government !== message.SystemGovernment.toLowerCase() ||
                                    system.allegiance !== message.SystemAllegiance.toLowerCase() ||
                                    system.state !== message.FactionState.toLowerCase() ||
                                    system.security !== message.SystemSecurity.toLowerCase() ||
                                    system.population !== message.Population ||
                                    system.controlling_minor_faction !== message.SystemFaction.toLowerCase() ||
                                    !_.isEqual(_.sortBy(system.factions, ['name_lower']), _.sortBy(factionArray, ['name_lower']))) {

                                    let historyModel = await ebgsHistorySystemV4Model;
                                    let timeNow = Date.now();
                                    let systemHistory = await historyModel.find({
                                        system_id: system._id,
                                        updated_at: {
                                            $lte: new Date(timeNow),
                                            $gte: new Date(timeNow - 172800000)
                                        }
                                    }).sort({ updated_at: -1 }).lean();
                                    if (this.checkSystemWHistory(message, systemHistory, factionArray)) {
                                        systemObject.government = message.SystemGovernment;
                                        systemObject.allegiance = message.SystemAllegiance;
                                        systemObject.state = message.FactionState;
                                        systemObject.security = message.SystemSecurity;
                                        systemObject.population = message.Population;
                                        systemObject.controlling_minor_faction = message.SystemFaction;
                                        systemObject.factions = factionArray;
                                        systemObject.updated_at = message.timestamp;

                                        historyObject.updated_at = message.timestamp;
                                        historyObject.updated_by = "EDDN";
                                        historyObject.government = message.SystemGovernment;
                                        historyObject.allegiance = message.SystemAllegiance;
                                        historyObject.state = message.FactionState;
                                        historyObject.security = message.SystemSecurity;
                                        historyObject.population = message.Population;
                                        historyObject.controlling_minor_faction = message.SystemFaction;
                                        historyObject.factions = factionArray;
                                    } else {
                                        systemObject = {};
                                    }
                                } else {
                                    systemObject.updated_at = message.timestamp;
                                }
                            }
                            if (!system.system_address || !system.secondary_economy) {
                                system.system_address = message.SystemAddress;
                                system.secondary_economy = message.SystemSecondEconomy;
                            }
                        } else {
                            eddbIdPromise = this.getSystemEDDBId(message.StarSystem);
                            systemObject = {
                                name: message.StarSystem,
                                name_lower: message.StarSystem.toLowerCase(),
                                system_address: message.SystemAddress,
                                x: this.correctCoordinates(message.StarPos[0]),
                                y: this.correctCoordinates(message.StarPos[1]),
                                z: this.correctCoordinates(message.StarPos[2]),
                                government: message.SystemGovernment,
                                allegiance: message.SystemAllegiance,
                                state: message.FactionState,
                                security: message.SystemSecurity,
                                population: message.Population,
                                primary_economy: message.SystemEconomy,
                                secondary_economy: message.SystemSecondEconomy,
                                controlling_minor_faction: message.SystemFaction,
                                factions: factionArray,
                                updated_at: message.timestamp
                            };

                            historyObject = {
                                updated_at: message.timestamp,
                                updated_by: "EDDN",
                                government: message.SystemGovernment,
                                allegiance: message.SystemAllegiance,
                                state: message.FactionState,
                                security: message.SystemSecurity,
                                population: message.Population,
                                controlling_minor_faction: message.SystemFaction,
                                factions: factionArray
                            };
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
                                        runValidators: true,
                                        new: true
                                    })
                                    .then(systemReturn => {
                                        if (!_.isEmpty(historyObject)) {
                                            historyObject.system_id = systemReturn._id;
                                            historyObject.system_name_lower = systemReturn.name_lower;
                                            this.setSystemHistory(historyObject);
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            } else {
                                try {
                                    let id = await eddbIdPromise;
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
                                            runValidators: true,
                                            new: true
                                        })
                                        .then(systemReturn => {
                                            if (!_.isEmpty(historyObject)) {
                                                historyObject.system_id = systemReturn._id;
                                                historyObject.system_name_lower = systemReturn.name_lower;
                                                this.setSystemHistory(historyObject);
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                } catch (err) {       // If eddb id cannot be fetched, create the record without it.
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
                                            runValidators: true,
                                            new: true
                                        })
                                        .then(systemReturn => {
                                            if (!_.isEmpty(historyObject)) {
                                                historyObject.system_id = systemReturn._id;
                                                historyObject.system_name_lower = systemReturn.name_lower;
                                                this.setSystemHistory(historyObject);
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                }
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                ebgsFactionsV4Model
                    .then(async (model) => {
                        let messageFactionsLower = [];
                        message.Factions.forEach(faction => {
                            messageFactionsLower.push(faction.Name.toLowerCase());
                        });

                        let allFactionsPresentInSystem = model.find(
                            {
                                faction_presence: {
                                    $elemMatch: { system_name_lower: message.StarSystem.toLowerCase() }
                                }
                            }
                        ).lean();

                        let allFactionsPresentInMessage = model.find(
                            {
                                name_lower: {
                                    $in: messageFactionsLower
                                }
                            }
                        ).lean();

                        try {
                            let values = await Promise.all([allFactionsPresentInSystem, allFactionsPresentInMessage])
                            let factionsPresentInSystemDB = values[0];
                            let factionsAllDetails = values[1];

                            let factionsNotInSystem = [];

                            factionsPresentInSystemDB.forEach(faction => {
                                factionsNotInSystem.push(faction.name_lower);
                            });

                            let toRemove = _.difference(factionsNotInSystem, messageFactionsLower);

                            let dbFactionsLower = [];

                            factionsAllDetails.forEach(faction => {
                                dbFactionsLower.push(faction.name_lower);
                            });
                            let notInDb = _.difference(messageFactionsLower, dbFactionsLower);
                            // To remove are those factions which are not present in this system anymore
                            // Such factions need to be updated too
                            for (let factionNameLower of toRemove) {
                                for (let faction of factionsPresentInSystemDB) {
                                    if (factionNameLower === faction.name_lower && faction.updated_at < new Date(message.timestamp)) {
                                        let factionPresence = [];
                                        faction.faction_presence.forEach(system => {
                                            if (system.system_name_lower !== message.StarSystem.toLowerCase()) {
                                                factionPresence.push(system);
                                            }
                                        });
                                        faction.faction_presence = factionPresence;
                                        faction.updated_at = message.timestamp;

                                        if (!faction.eddb_id) {
                                            try {
                                                let id = await this.getFactionEDDBId(faction.name);
                                                faction.eddb_id = id;
                                                model.findOneAndUpdate(
                                                    {
                                                        name: faction.name
                                                    },
                                                    faction,
                                                    {
                                                        upsert: true,
                                                        runValidators: true
                                                    })
                                                    .exec()
                                                    .catch(err => {
                                                        console.log(err);
                                                    })
                                            } catch (err) {
                                                model.findOneAndUpdate(
                                                    {
                                                        name: faction.name
                                                    },
                                                    faction,
                                                    {
                                                        upsert: true,
                                                        runValidators: true
                                                    })
                                                    .exec()
                                                    .catch(err => {
                                                        console.log(err);
                                                    })
                                            }
                                        } else {
                                            model.findOneAndUpdate(
                                                {
                                                    name: faction.name
                                                },
                                                faction,
                                                {
                                                    upsert: true,
                                                    runValidators: true
                                                })
                                                .exec()
                                                .catch(err => {
                                                    console.log(err);
                                                })
                                        }
                                    }
                                }
                            }
                            // Not In DB means that the message contains a faction which is not present in the db yet
                            // So one must create a new record
                            for (let factionNameLower of notInDb) {
                                for (let messageFaction of message.Factions) {
                                    if (messageFaction.Name.toLowerCase() === factionNameLower) {
                                        let activeStates = [];
                                        if (messageFaction.ActiveStates) {
                                            messageFaction.ActiveStates.forEach(activeState => {
                                                let activeStateObject = {
                                                    state: activeState.State.toLowerCase(),
                                                };
                                                activeStates.push(activeStateObject);
                                            });
                                        };
                                        let pendingStates = [];
                                        if (messageFaction.PendingStates) {
                                            messageFaction.PendingStates.forEach(pendingState => {
                                                let pendingStateObject = {
                                                    state: pendingState.State.toLowerCase(),
                                                    trend: pendingState.Trend
                                                };
                                                pendingStates.push(pendingStateObject);
                                            });
                                        };
                                        let recoveringStates = [];
                                        if (messageFaction.RecoveringStates) {
                                            messageFaction.RecoveringStates.forEach(recoveringState => {
                                                let recoveringStateObject = {
                                                    state: recoveringState.State.toLowerCase(),
                                                    trend: recoveringState.Trend
                                                };
                                                recoveringStates.push(recoveringStateObject);
                                            });
                                        };

                                        let factionObject = {
                                            name: messageFaction.Name,
                                            name_lower: messageFaction.Name.toLowerCase(),
                                            updated_at: message.timestamp,
                                            government: messageFaction.Government,
                                            allegiance: messageFaction.Allegiance,
                                            faction_presence: [{
                                                system_name: message.StarSystem,
                                                system_name_lower: message.StarSystem.toLowerCase(),
                                                state: messageFaction.FactionState,
                                                influence: messageFaction.Influence,
                                                happiness: messageFaction.Happiness.toLowerCase(),
                                                active_states: activeStates,
                                                pending_states: pendingStates,
                                                recovering_states: recoveringStates,
                                                updated_at: message.timestamp
                                            }]
                                        };
                                        let historyObject = {
                                            updated_at: message.timestamp,
                                            updated_by: "EDDN",
                                            system: message.StarSystem,
                                            system_lower: message.StarSystem.toLowerCase(),
                                            state: messageFaction.FactionState,
                                            influence: messageFaction.Influence,
                                            happiness: messageFaction.Happiness.toLowerCase(),
                                            active_states: activeStates,
                                            pending_states: pendingStates,
                                            recovering_states: recoveringStates,
                                            systems: [{
                                                name: message.StarSystem,
                                                name_lower: message.StarSystem.toLowerCase()
                                            }]
                                        };
                                        try {
                                            let id = await this.getFactionEDDBId(messageFaction.Name);
                                            factionObject.eddb_id = id;
                                            model.findOneAndUpdate(
                                                {
                                                    name: factionObject.name
                                                },
                                                factionObject,
                                                {
                                                    upsert: true,
                                                    runValidators: true,
                                                    new: true
                                                })
                                                .then(factionReturn => {
                                                    historyObject.faction_id = factionReturn._id;
                                                    historyObject.faction_name_lower = factionReturn.name_lower;
                                                    this.setFactionHistory(historyObject);
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                });
                                        } catch (err) {
                                            model.findOneAndUpdate(
                                                {
                                                    name: factionObject.name
                                                },
                                                factionObject,
                                                {
                                                    upsert: true,
                                                    runValidators: true,
                                                    new: true
                                                })
                                                .then(factionReturn => {
                                                    historyObject.faction_id = factionReturn._id;
                                                    historyObject.faction_name_lower = factionReturn.name_lower;
                                                    this.setFactionHistory(historyObject);
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                });
                                        }
                                    }
                                }
                            }
                            // dbFactionsLower are the factions present in the db. So next we need to update them
                            // factionsAllDetails has all the factions details
                            for (let dbFaction of factionsAllDetails) {
                                let factionPresence = dbFaction.faction_presence.find(presence => {
                                    return presence.system_name_lower === message.StarSystem.toLowerCase();
                                });
                                for (let messageFaction of message.Factions) {
                                    if (!factionPresence || !factionPresence.updated_at) {
                                        factionPresence = {
                                            updated_at: dbFaction.updated_at
                                        };
                                    }
                                    if (messageFaction.Name.toLowerCase() === dbFaction.name_lower && factionPresence.updated_at < new Date(message.timestamp)) {
                                        let getDoFactionUpdate = await this.doFactionUpdate(messageFaction, dbFaction, message);
                                        let activeStates = getDoFactionUpdate.activeStates;
                                        let pendingStates = getDoFactionUpdate.pendingStates;
                                        let recoveringStates = getDoFactionUpdate.recoveringStates;
                                        let doUpdate = getDoFactionUpdate.doUpdate;
                                        let dontUpdateTime = getDoFactionUpdate.dontUpdateTime;
                                        if (doUpdate) {
                                            let factionPresentSystemObject = {};
                                            let factionPresence = dbFaction.faction_presence;

                                            factionPresence.forEach((factionPresenceObject, index, factionPresenceArray) => {
                                                if (factionPresenceObject.system_name_lower === message.StarSystem.toLowerCase()) {
                                                    factionPresentSystemObject = {
                                                        system_name: message.StarSystem,
                                                        system_name_lower: message.StarSystem.toLowerCase(),
                                                        state: messageFaction.FactionState,
                                                        influence: messageFaction.Influence,
                                                        happiness: messageFaction.Happiness.toLowerCase(),
                                                        active_states: activeStates,
                                                        pending_states: pendingStates,
                                                        recovering_states: recoveringStates,
                                                        updated_at: message.timestamp
                                                    };
                                                    factionPresenceArray[index] = factionPresentSystemObject;
                                                }
                                            });

                                            if (_.isEmpty(factionPresentSystemObject)) {
                                                // This system is not present as a presence system in db.
                                                // Make a new array element
                                                factionPresence.push({
                                                    system_name: message.StarSystem,
                                                    system_name_lower: message.StarSystem.toLowerCase(),
                                                    state: messageFaction.FactionState,
                                                    influence: messageFaction.Influence,
                                                    happiness: messageFaction.Happiness.toLowerCase(),
                                                    active_states: activeStates,
                                                    pending_states: pendingStates,
                                                    recovering_states: recoveringStates,
                                                    updated_at: message.timestamp
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
                                                name: messageFaction.Name,
                                                name_lower: messageFaction.Name.toLowerCase(),
                                                updated_at: message.timestamp,
                                                government: messageFaction.Government,
                                                allegiance: messageFaction.Allegiance,
                                                faction_presence: factionPresence
                                            };
                                            let historyObject = {
                                                updated_at: message.timestamp,
                                                updated_by: "EDDN",
                                                system: message.StarSystem,
                                                system_lower: message.StarSystem.toLowerCase(),
                                                state: messageFaction.FactionState,
                                                influence: messageFaction.Influence,
                                                happiness: messageFaction.Happiness.toLowerCase(),
                                                active_states: activeStates,
                                                pending_states: pendingStates,
                                                recovering_states: recoveringStates,
                                                systems: systemHistory
                                            }
                                            if (!dbFaction.eddb_id) {
                                                try {
                                                    let id = await this.getFactionEDDBId(messageFaction.Name);
                                                    factionObject.eddb_id = id;
                                                    model.findOneAndUpdate(
                                                        {
                                                            name: messageFaction.Name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true,
                                                            new: true
                                                        })
                                                        .then(factionReturn => {
                                                            historyObject.faction_id = factionReturn._id;
                                                            historyObject.faction_name_lower = factionReturn.name_lower;
                                                            this.setFactionHistory(historyObject);
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });
                                                } catch (err) {
                                                    model.findOneAndUpdate(
                                                        {
                                                            name: messageFaction.Name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true,
                                                            new: true
                                                        })
                                                        .then(factionReturn => {
                                                            historyObject.faction_id = factionReturn._id;
                                                            historyObject.faction_name_lower = factionReturn.name_lower;
                                                            this.setFactionHistory(historyObject);
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });
                                                }
                                            } else {
                                                model.findOneAndUpdate(
                                                    {
                                                        name: messageFaction.Name
                                                    },
                                                    factionObject,
                                                    {
                                                        upsert: true,
                                                        runValidators: true,
                                                        new: true
                                                    })
                                                    .then(factionReturn => {
                                                        historyObject.faction_id = factionReturn._id;
                                                        historyObject.faction_name_lower = factionReturn.name_lower;
                                                        this.setFactionHistory(historyObject);
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    });
                                            }
                                        } else if (!dontUpdateTime) {
                                            let factionPresentSystemObject = {};
                                            let factionPresence = dbFaction.faction_presence;

                                            factionPresence.forEach((factionPresenceObject, index, factionPresenceArray) => {
                                                if (factionPresenceObject.system_name_lower === message.StarSystem.toLowerCase()) {
                                                    factionPresentSystemObject = {
                                                        system_name: message.StarSystem,
                                                        system_name_lower: message.StarSystem.toLowerCase(),
                                                        state: messageFaction.FactionState,
                                                        influence: messageFaction.Influence,
                                                        happiness: messageFaction.Happiness.toLowerCase(),
                                                        active_states: activeStates,
                                                        pending_states: pendingStates,
                                                        recovering_states: recoveringStates,
                                                        updated_at: message.timestamp
                                                    };
                                                    factionPresenceArray[index] = factionPresentSystemObject;
                                                }
                                            });
                                            let factionObject = {
                                                updated_at: message.timestamp,
                                                faction_presence: factionPresence
                                            };
                                            if (!dbFaction.eddb_id) {
                                                try {
                                                    let id = await this.getFactionEDDBId(messageFaction.Name);
                                                    factionObject.eddb_id = id;
                                                    model.findOneAndUpdate(
                                                        {
                                                            name: messageFaction.Name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true,
                                                            new: true
                                                        })
                                                        .exec()
                                                        .catch(err => {
                                                            console.log(err);
                                                        });
                                                } catch (err) {
                                                    model.findOneAndUpdate(
                                                        {
                                                            name: messageFaction.Name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true,
                                                            new: true
                                                        })
                                                        .exec()
                                                        .catch(err => {
                                                            console.log(err);
                                                        });
                                                }
                                            } else {
                                                model.findOneAndUpdate(
                                                    {
                                                        name: messageFaction.Name
                                                    },
                                                    factionObject,
                                                    {
                                                        upsert: true,
                                                        runValidators: true,
                                                        new: true
                                                    })
                                                    .exec()
                                                    .catch(err => {
                                                        console.log(err);
                                                    });
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } catch (err) {
                if (err) {
                    console.log(err)
                }
            }
        } else if (message.event === "Docked") {
            try {
                await this.checkMessage2(message, header)
                let serviceArray = [];
                message.StationServices.forEach(service => {
                    let serviceObject = {
                        name: service,
                        name_lower: service.toLowerCase()
                    };
                    serviceArray.push(serviceObject);
                });
                ebgsStationsV4Model
                    .then(async (model) => {
                        let station = await model.findOne(
                            {
                                name_lower: message.StationName.toLowerCase(),
                                system_lower: message.StarSystem.toLowerCase()
                            }
                        ).lean();
                        let hasEddbId = false;
                        let stationObject = {};
                        let historyObject = {};
                        let eddbIdPromise;
                        if (station) {   // Station exists in db
                            if (station.updated_at < new Date(message.timestamp)) {
                                if (!station.eddb_id) {
                                    eddbIdPromise = this.getStationEDDBId(message.StationName);
                                } else {
                                    stationObject.eddb_id = station.eddb_id;
                                    hasEddbId = true;
                                }
                                if (station.government !== message.StationGovernment.toLowerCase() ||
                                    station.allegiance !== message.StationAllegiance.toLowerCase() ||
                                    station.state !== message.FactionState.toLowerCase() ||
                                    station.controlling_minor_faction !== message.StationFaction.toLowerCase() ||
                                    !_.isEqual(_.sortBy(station.services, ['name_lower']), _.sortBy(serviceArray, ['name_lower']))) {

                                    let historyModel = await ebgsHistoryStationV4Model;
                                    let timeNow = Date.now();
                                    let stationHistory = await historyModel.find({
                                        station_id: station._id,
                                        updated_at: {
                                            $lte: new Date(timeNow),
                                            $gte: new Date(timeNow - 172800000)
                                        }
                                    }).sort({ updated_at: -1 }).lean();
                                    if (this.checkStationWHistory(message, stationHistory, serviceArray)) {
                                        stationObject.type = message.StationType;
                                        stationObject.system = message.StarSystem;
                                        stationObject.system_lower = message.StarSystem.toLowerCase();
                                        stationObject.government = message.StationGovernment;
                                        stationObject.economy = message.StationEconomy;
                                        stationObject.allegiance = message.StationAllegiance;
                                        stationObject.state = message.FactionState;
                                        stationObject.distance_from_star = message.DistFromStarLS;
                                        stationObject.controlling_minor_faction = message.StationFaction;
                                        stationObject.services = serviceArray;
                                        stationObject.updated_at = message.timestamp;

                                        historyObject.updated_at = message.timestamp;
                                        historyObject.updated_by = "EDDN";
                                        historyObject.government = message.StationGovernment;
                                        historyObject.allegiance = message.StationAllegiance;
                                        historyObject.state = message.FactionState;
                                        historyObject.controlling_minor_faction = message.StationFaction;
                                        historyObject.services = serviceArray;
                                    } else {
                                        stationObject = {};
                                    }
                                } else {
                                    stationObject.updated_at = message.timestamp;
                                }
                            }
                        } else {
                            eddbIdPromise = this.getStationEDDBId(message.StationName);
                            stationObject = {
                                name: message.StationName,
                                name_lower: message.StationName.toLowerCase(),
                                system: message.StarSystem,
                                system_lower: message.StarSystem.toLowerCase(),
                                type: message.StationType,
                                government: message.StationGovernment,
                                economy: message.StationEconomy,
                                allegiance: message.StationAllegiance,
                                state: message.FactionState,
                                distance_from_star: message.DistFromStarLS,
                                controlling_minor_faction: message.StationFaction,
                                services: serviceArray,
                                updated_at: message.timestamp,
                            };

                            historyObject = {
                                updated_at: message.timestamp,
                                updated_by: "EDDN",
                                government: message.StationGovernment,
                                allegiance: message.StationAllegiance,
                                state: message.FactionState,
                                controlling_minor_faction: message.StationFaction,
                                services: serviceArray
                            };
                        }
                        if (!_.isEmpty(stationObject)) {
                            if (hasEddbId) {
                                model.findOneAndUpdate(
                                    {
                                        name_lower: message.StationName.toLowerCase(),
                                        system_lower: message.StarSystem.toLowerCase()
                                    },
                                    stationObject,
                                    {
                                        upsert: true,
                                        runValidators: true,
                                        new: true
                                    })
                                    .then(stationReturn => {
                                        if (!_.isEmpty(historyObject)) {
                                            historyObject.station_id = stationReturn._id;
                                            historyObject.station_name_lower = stationReturn.name_lower;
                                            this.setStationHistory(historyObject);
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            } else {
                                try {
                                    let id = await eddbIdPromise;
                                    stationObject.eddb_id = id;
                                    model.findOneAndUpdate(
                                        {
                                            name_lower: message.StationName.toLowerCase(),
                                            system_lower: message.StarSystem.toLowerCase()
                                        },
                                        stationObject,
                                        {
                                            upsert: true,
                                            runValidators: true,
                                            new: true
                                        })
                                        .then(stationReturn => {
                                            if (!_.isEmpty(historyObject)) {
                                                historyObject.station_id = stationReturn._id;
                                                historyObject.station_name_lower = stationReturn.name_lower;
                                                this.setStationHistory(historyObject);
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                } catch (err) {
                                    model.findOneAndUpdate(
                                        {
                                            name_lower: message.StationName.toLowerCase(),
                                            system_lower: message.StarSystem.toLowerCase()
                                        },
                                        stationObject,
                                        {
                                            upsert: true,
                                            runValidators: true,
                                            new: true
                                        })
                                        .then(stationReturn => {
                                            if (!_.isEmpty(historyObject)) {
                                                historyObject.station_id = stationReturn._id;
                                                historyObject.station_name_lower = stationReturn.name_lower;
                                                this.setStationHistory(historyObject);
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                }
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } catch (err) {
                if (err) {
                    console.log(err)
                }
            }
        }
    }

    this.checkMessage = function (message) {
        if (
            message.StarSystem &&
            message.SystemFaction &&
            message.timestamp &&
            message.SystemSecurity &&
            message.SystemAllegiance &&
            message.SystemEconomy &&
            message.StarPos &&
            message.Factions &&
            message.event &&
            message.SystemGovernment &&
            message.Population
        ) {
            if (!message.FactionState) {
                message.FactionState = "None";
            }
            let messageTimestamp = new Date(message.timestamp);
            let oldestTimestamp = new Date("2017-10-07T00:00:00Z");
            if (messageTimestamp < oldestTimestamp) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    this.checkMessage1 = async function (message, header) {
        try {
            if (
                message.StarSystem &&
                message.SystemFaction &&
                message.SystemAddress &&
                message.timestamp &&
                message.SystemSecurity &&
                message.SystemAllegiance &&
                message.SystemEconomy &&
                message.SystemSecondEconomy &&
                message.StarPos &&
                message.Factions &&
                message.event &&
                message.SystemGovernment
            ) {
                if (!message.FactionState) {
                    message.FactionState = "None";
                }
                if (!message.Population) {
                    message.Population = 0;
                }
                let configCheckModel = await configModel;
                let configRecord = await configCheckModel.findOne({}).lean();
                if (configRecord.blacklisted_software.findIndex(software => {
                    let regexp = new RegExp(software, "i");
                    return regexp.test(header.softwareName);
                }) != -1) {
                    return Promise.reject("Message from blacklisted software " + header.softwareName);
                }
                let pass = true;
                configRecord.version_software.forEach(software => {
                    if (header.softwareName.toLowerCase() === software.name.toLowerCase()) {
                        if (semver.lt(semver.coerce(header.softwareVersion), semver.coerce(software.version))) {
                            pass = false;
                        }
                    }
                });
                if (!pass) {
                    return Promise.reject("Message from old version " + header.softwareVersion + " software " + header.softwareName);
                }
                let messageTimestamp = new Date(message.timestamp);
                let oldestTimestamp = new Date("2017-10-07T00:00:00Z");
                let currentTimestamp = new Date(Date.now() + configRecord.time_offset);
                if (messageTimestamp < oldestTimestamp || messageTimestamp > currentTimestamp) {
                    return Promise.reject("Message timestamp too old or in the future");
                } else {
                    return Promise.resolve();
                }
            } else {
                return Promise.reject();
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    this.checkMessage2 = async function (message, header) {
        try {
            if (
                message.StarSystem &&
                message.timestamp &&
                message.StarPos &&
                message.event &&
                message.DistFromStarLS &&
                message.StationAllegiance &&
                message.StationEconomy &&
                message.StationFaction &&
                message.StationGovernment &&
                message.StationName &&
                message.StationServices &&
                message.StationType
            ) {
                if (!message.FactionState) {
                    message.FactionState = "None";
                }
                if (!message.StationAllegiance) {
                    message.StationAllegiance = "Independent";
                }
                let configCheckModel = await configModel;
                let configRecord = await configCheckModel.findOne({}).lean();
                if (configRecord.blacklisted_software.findIndex(software => {
                    let regexp = new RegExp(software, "i");
                    return regexp.test(header.softwareName);
                }) != -1) {
                    return Promise.reject("Message from blacklisted software " + header.softwareName);
                }
                let pass = true;
                configRecord.version_software.forEach(software => {
                    let regexp = new RegExp(software.name, "i");
                    if (regexp.test(header.softwareName)) {
                        if (semver.lt(semver.coerce(header.softwareVersion), semver.coerce(software.version))) {
                            pass = false;
                        }
                    }
                });
                if (!pass) {
                    return Promise.reject("Message from old version " + header.softwareVersion + " software " + header.softwareName);
                }
                let messageTimestamp = new Date(message.timestamp);
                let oldestTimestamp = new Date("2017-10-07T00:00:00Z");
                let currentTimestamp = new Date(Date.now() + configRecord.time_offset);
                if (messageTimestamp < oldestTimestamp || messageTimestamp > currentTimestamp) {
                    return Promise.reject("Message timestamp too old or in the future");
                } else {
                    return Promise.resolve();
                }
            } else {
                return Promise.reject();
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    this.checkSystemWHistory = function (message, history, factionArray) {
        for (let item of history) {
            if (item.government === message.SystemGovernment.toLowerCase() &&
                item.allegiance === message.SystemAllegiance.toLowerCase() &&
                item.state === message.FactionState.toLowerCase() &&
                item.security === message.SystemSecurity.toLowerCase() &&
                item.population === message.Population &&
                item.controlling_minor_faction === message.SystemFaction.toLowerCase() &&
                _.isEqual(_.sortBy(item.factions, ['name_lower']), _.sortBy(factionArray, ['name_lower']))) {
                return false;
            }
        }
        return true;
    }

    this.checkFactionWHistory = function (message, messageFaction, history, activeStates,  pendingStates, recoveringStates) {
        for (let item of history) {
            if (item.system_lower === message.StarSystem.toLowerCase() &&
                item.state === messageFaction.FactionState.toLowerCase() &&
                item.influence === messageFaction.Influence &&
                _.isEqual(_.sortBy(item.active_states, ['state']), _.sortBy(activeStates, ['state'])) &&
                _.isEqual(_.sortBy(item.pending_states, ['state']), _.sortBy(pendingStates, ['state'])) &&
                _.isEqual(_.sortBy(item.recovering_states, ['state']), _.sortBy(recoveringStates, ['state']))) {
                return false;
            }
        }
        return true;
    }

    this.checkStationWHistory = function (message, history, serviceArray) {
        for (let item of history) {
            if (item.government === message.StationGovernment.toLowerCase() &&
                item.allegiance === message.StationAllegiance.toLowerCase() &&
                item.state === message.FactionState.toLowerCase() &&
                item.controlling_minor_faction === message.StationFaction.toLowerCase() &&
                _.isEqual(_.sortBy(item.services, ['name_lower']), _.sortBy(serviceArray, ['name_lower']))) {
                return false;
            }
        }
        return true;
    }

    this.doFactionUpdate = async function (messageFaction, dbFaction, message) {
        let activeStates = [];
        if (messageFaction.ActiveStates) {
            messageFaction.ActiveStates.forEach(activeState => {
                let activeStateObject = {
                    state: activeState.State.toLowerCase()
                };
                activeStates.push(activeStateObject);
            });
        };
        let pendingStates = [];
        if (messageFaction.PendingStates) {
            messageFaction.PendingStates.forEach(pendingState => {
                let pendingStateObject = {
                    state: pendingState.State.toLowerCase(),
                    trend: pendingState.Trend
                };
                pendingStates.push(pendingStateObject);
            });
        };
        let recoveringStates = [];
        if (messageFaction.RecoveringStates) {
            messageFaction.RecoveringStates.forEach(recoveringState => {
                let recoveringStateObject = {
                    state: recoveringState.State.toLowerCase(),
                    trend: recoveringState.Trend
                };
                recoveringStates.push(recoveringStateObject);
            });
        };

        // Check if the incoming message has any different faction detail
        let doUpdate = true;
        let dontUpdateTime = false;
        if (dbFaction.updated_at > new Date(message.timestamp)) {
            dontUpdateTime = true;
        }
        for (let faction of dbFaction.faction_presence) {
            if (faction.system_name_lower === message.StarSystem.toLowerCase()) {
                if (faction.state === messageFaction.FactionState.toLowerCase() &&
                    faction.influence === messageFaction.Influence &&
                    _.isEqual(_.sortBy(faction.active_states, ['state']), _.sortBy(activeStates, ['state'])) &&
                    _.isEqual(_.sortBy(faction.pending_states, ['state']), _.sortBy(pendingStates, ['state'])) &&
                    _.isEqual(_.sortBy(faction.recovering_states, ['state']), _.sortBy(recoveringStates, ['state']))) {
                    doUpdate = false;
                } else {
                    let historyModel = await ebgsHistoryFactionV4Model;
                    let timeNow = Date.now();
                    let factionHistory = await historyModel.find({
                        faction_id: dbFaction._id,
                        system_lower: faction.system_name_lower,
                        updated_at: {
                            $lte: new Date(timeNow),
                            $gte: new Date(timeNow - 172800000)
                        }
                    }).sort({ updated_at: -1 }).lean();
                    if (!this.checkFactionWHistory(message, messageFaction, factionHistory, activeStates, pendingStates, recoveringStates)) {
                        doUpdate = false;
                        dontUpdateTime = true;
                    }
                }
            }
        }

        return { pendingStates, recoveringStates, doUpdate, dontUpdateTime }
    }

    this.correctCoordinates = function (value) {
        let floatValue = Number.parseFloat(value);
        let intValue = Math.round(floatValue * 32);
        return intValue / 32;
    }

    this.getSystemEDDBId = function (name) {
        return new Promise((resolve, reject) => {
            let requestOptions = {
                url: "https://elitebgs.kodeblox.com/api/eddb/v3/populatedsystems",
                method: "GET",
                qs: {
                    name: name.toLowerCase()
                }
            };
            request(requestOptions, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let responseObject = JSON.parse(body);
                    if (responseObject.total > 0) {
                        resolve(responseObject.docs[0].id);
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }
            });
        })
    }

    this.getFactionEDDBId = function (name) {
        return new Promise((resolve, reject) => {
            let requestOptions = {
                url: "https://elitebgs.kodeblox.com/api/eddb/v3/factions",
                method: "GET",
                qs: {
                    name: name.toLowerCase()
                }
            };
            request(requestOptions, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let responseObject = JSON.parse(body);
                    if (responseObject.total > 0) {
                        resolve(responseObject.docs[0].id);
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }
            });
        })
    }

    this.getStationEDDBId = function (name) {
        return new Promise((resolve, reject) => {
            let requestOptions = {
                url: "https://elitebgs.kodeblox.com/api/eddb/v3/stations",
                method: "GET",
                qs: {
                    name: name.toLowerCase()
                }
            };
            request(requestOptions, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let responseObject = JSON.parse(body);
                    if (responseObject.total > 0) {
                        resolve(responseObject.docs[0].id);
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }
            });
        })
    }

    this.setSystemHistory = function (historyObject) {
        return new Promise((resolve, reject) => {
            ebgsHistorySystemV4Model
                .then(model => {
                    let document = new model(historyObject);
                    document.save()
                        .then(() => {
                            resolve();
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                });
        })
    }

    this.setFactionHistory = function (historyObject) {
        return new Promise((resolve, reject) => {
            ebgsHistoryFactionV4Model
                .then(model => {
                    let document = new model(historyObject);
                    document.save()
                        .then(() => {
                            resolve();
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                });
        })
    }

    this.setStationHistory = function (historyObject) {
        return new Promise((resolve, reject) => {
            ebgsHistoryStationV4Model
                .then(model => {
                    let document = new model(historyObject);
                    document.save()
                        .then(() => {
                            resolve();
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                });
        })
    }
}
