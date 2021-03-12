/*
 * KodeBlox Copyright 2021 Sayak Mukhopadhyay
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
const request = require('request-promise-native');
const semver = require('semver');

const bugsnagCaller = require('../bugsnag').bugsnagCaller;

const ebgsFactionsModel = require('../models/ebgs_factions');
const ebgsSystemsModel = require('../models/ebgs_systems');

const ebgsFactionsV3Model = require('../models/ebgs_factions_v3');
const ebgsSystemsV3Model = require('../models/ebgs_systems_v3');

const ebgsFactionsV4Model = require('../models/ebgs_factions_v4');
const ebgsSystemsV4Model = require('../models/ebgs_systems_v4');
const ebgsStationsV4Model = require('../models/ebgs_stations_v4');
const ebgsHistoryFactionV4Model = require('../models/ebgs_history_faction_v4');
const ebgsHistorySystemV4Model = require('../models/ebgs_history_system_v4');
const ebgsHistoryStationV4Model = require('../models/ebgs_history_station_v4');

const configModel = require('../models/configs');

const nonBGSFactions = require('../nonBGSFactions');

module.exports = Journal;

function Journal() {
    this.schemaId = [
        // "http://schemas.elite-markets.net/eddn/journal/1",
        "https://eddn.edcd.io/schemas/journal/1"
        // "https://eddn.edcd.io/schemas/journal/1/test"
    ];

    this.trackSystem = async message => {
        try {
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

                    for (let faction of message.Factions) {
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
                        }

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

                        ebgsFactionsModel.findOneAndUpdate(
                            { name: faction.Name },
                            factionObject,
                            {
                                upsert: true,
                                runValidators: true
                            })
                            .exec();
                    }
                    systemObject.minor_faction_presences = factionArray;
                    ebgsSystemsModel.findOneAndUpdate(
                        { name: systemObject.name },
                        systemObject,
                        {
                            upsert: true,
                            runValidators: true
                        })
                        .exec();
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    this.trackSystemV3 = async message => {
        try {
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
                    (async () => {
                        try {
                            let system = await ebgsSystemsV3Model.findOne(
                                {
                                    name_lower: message.StarSystem.toLowerCase(),
                                    x: this.correctCoordinates(message.StarPos[0]),
                                    y: this.correctCoordinates(message.StarPos[1]),
                                    z: this.correctCoordinates(message.StarPos[2])
                                },
                                { history: 0 }
                            ).lean();
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
                                    ebgsSystemsV3Model.findOneAndUpdate(
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
                                        .exec();
                                } else {
                                    try {
                                        let id = await eddbIdPromise;
                                        systemObject.eddb_id = id;
                                        try {
                                            await ebgsSystemsV3Model.findOneAndUpdate(
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
                                                .exec();
                                        } catch (err) {
                                            console.log(err);
                                        }
                                    } catch (err) {   // If eddb id cannot be fetched, create the record without it.
                                        try {
                                            await ebgsSystemsV3Model.findOneAndUpdate(
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
                                                .exec();
                                        } catch (err) {
                                            console.log(err);
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    })();
                    (async () => {
                        try {
                            let messageFactionsLower = [];
                            message.Factions.forEach(faction => {
                                messageFactionsLower.push(faction.Name.toLowerCase());
                            });

                            let allFactionsPresentInSystem = ebgsFactionsV3Model.find(
                                {
                                    faction_presence: {
                                        $elemMatch: { system_name_lower: message.StarSystem.toLowerCase() }
                                    }
                                },
                                { history: 0 }
                            ).lean();

                            let allFactionsPresentInMessage = ebgsFactionsV3Model.find(
                                {
                                    name_lower: {
                                        $in: messageFactionsLower
                                    }
                                },
                                { history: 0 }
                            ).lean();

                            let values = await Promise.all([allFactionsPresentInSystem, allFactionsPresentInMessage]);
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
                                        (async () => {
                                            if (!faction.eddb_id) {
                                                try {
                                                    let id = await this.getFactionEDDBId(faction.name);
                                                    faction.eddb_id = id;
                                                    try {
                                                        ebgsFactionsV3Model.findOneAndUpdate(
                                                            {
                                                                name: faction.name
                                                            },
                                                            faction,
                                                            {
                                                                upsert: true,
                                                                runValidators: true
                                                            })
                                                            .exec();
                                                    } catch (err) {
                                                        console.log(err);
                                                    }
                                                } catch (err) {
                                                    try {
                                                        ebgsFactionsV3Model.findOneAndUpdate(
                                                            {
                                                                name: faction.name
                                                            },
                                                            faction,
                                                            {
                                                                upsert: true,
                                                                runValidators: true
                                                            })
                                                            .exec();
                                                    } catch (err) {
                                                        console.log(err);
                                                    }
                                                }
                                            } else {
                                                ebgsFactionsV3Model.findOneAndUpdate(
                                                    {
                                                        name: faction.name
                                                    },
                                                    faction,
                                                    {
                                                        upsert: true,
                                                        runValidators: true
                                                    })
                                                    .exec();
                                            }
                                        })()
                                    }
                                }
                            }
                            // Not In DB means that the message contains a faction which is not present in the db yet
                            // So one must create a new record
                            for (let factionNameLower of notInDb) {
                                for (let messageFaction of message.Factions) {
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
                                        }
                                        let recoveringStates = [];
                                        if (messageFaction.RecoveringStates) {
                                            messageFaction.RecoveringStates.forEach(recoveringState => {
                                                let recoveringStateObject = {
                                                    state: recoveringState.State.toLowerCase(),
                                                    trend: recoveringState.Trend
                                                };
                                                recoveringStates.push(recoveringStateObject);
                                            });
                                        }

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
                                        (async () => {
                                            try {
                                                let id = await this.getFactionEDDBId(messageFaction.Name);
                                                try {
                                                    ebgsFactionsV3Model.findOneAndUpdate(
                                                        {
                                                            name: factionObject.name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true
                                                        })
                                                        .exec();
                                                } catch (err) {
                                                    console.log(err);
                                                }
                                            } catch (err) {
                                                try {
                                                    ebgsFactionsV3Model.findOneAndUpdate(
                                                        {
                                                            name: factionObject.name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true
                                                        })
                                                        .exec();
                                                } catch (err) {
                                                    console.log(err);
                                                }
                                            }
                                        })();
                                    }
                                }
                            }
                            // dbFactionsLower are the factions present in the db. So next we need to update them
                            // factionsAllDetails has all the factions details
                            for (let dbFaction of factionsAllDetails) {
                                for (let messageFaction of message.Factions) {
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
                                        }
                                        let recoveringStates = [];
                                        if (messageFaction.RecoveringStates) {
                                            messageFaction.RecoveringStates.forEach(recoveringState => {
                                                let recoveringStateObject = {
                                                    state: recoveringState.State.toLowerCase(),
                                                    trend: recoveringState.Trend
                                                };
                                                recoveringStates.push(recoveringStateObject);
                                            });
                                        }

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
                                            (async () => {
                                                if (!dbFaction.eddb_id) {
                                                    try {
                                                        let id = await this.getFactionEDDBId(messageFaction.Name)
                                                        factionObject.eddb_id = id;
                                                        try {
                                                            ebgsFactionsV3Model.findOneAndUpdate(
                                                                {
                                                                    name: messageFaction.Name
                                                                },
                                                                factionObject,
                                                                {
                                                                    upsert: true,
                                                                    runValidators: true
                                                                })
                                                                .exec();
                                                        } catch (err) {
                                                            console.log(err);
                                                        }
                                                    } catch (err) {
                                                        try {
                                                            ebgsFactionsV3Model.findOneAndUpdate(
                                                                {
                                                                    name: messageFaction.Name
                                                                },
                                                                factionObject,
                                                                {
                                                                    upsert: true,
                                                                    runValidators: true
                                                                })
                                                                .exec()
                                                        } catch (err) {
                                                            console.log(err);
                                                        }
                                                    }
                                                    let id = await this.getFactionEDDBId(messageFaction.Name)
                                                    factionObject.eddb_id = id;
                                                    try {
                                                        ebgsFactionsV3Model.findOneAndUpdate(
                                                            {
                                                                name: messageFaction.Name
                                                            },
                                                            factionObject,
                                                            {
                                                                upsert: true,
                                                                runValidators: true
                                                            })
                                                            .exec();
                                                    } catch (err) {
                                                        console.log(err);
                                                    }
                                                } else {
                                                    try {
                                                        ebgsFactionsV3Model.findOneAndUpdate(
                                                            {
                                                                name: messageFaction.Name
                                                            },
                                                            factionObject,
                                                            {
                                                                upsert: true,
                                                                runValidators: true
                                                            })
                                                            .exec()
                                                    } catch (err) {
                                                        console.log(err);
                                                    }
                                                }
                                            })();
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    })();
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    this.trackSystemV4 = async (message, header) => {
        if (message.event === "FSDJump" || message.event === "Location" || message.event === "CarrierJump") {
            try {
                await this.checkMessage1(message, header);
                message.Factions = message.Factions.filter(faction => {
                    return nonBGSFactions.indexOf(faction.Name) === -1;
                });
                let factionArray = [];
                message.Factions.forEach(faction => {
                    let factionObject = {
                        name: faction.Name,
                        name_lower: faction.Name.toLowerCase()
                    };
                    factionArray.push(factionObject);
                });
                let conflictsArray = [];
                message.Conflicts.forEach(conflict => {
                    let conflictObject = {
                        type: conflict.WarType,
                        status: conflict.Status,
                        faction1: {
                            name: conflict.Faction1.Name,
                            name_lower: conflict.Faction1.Name.toLowerCase(),
                            stake: conflict.Faction1.Stake,
                            stake_lower: conflict.Faction1.Stake.toLowerCase(),
                            days_won: conflict.Faction1.WonDays
                        },
                        faction2: {
                            name: conflict.Faction2.Name,
                            name_lower: conflict.Faction2.Name.toLowerCase(),
                            stake: conflict.Faction2.Stake,
                            stake_lower: conflict.Faction2.Stake.toLowerCase(),
                            days_won: conflict.Faction2.WonDays
                        }
                    };
                    conflictsArray.push(conflictObject);
                });
                (async () => {
                    try {
                        let system = await ebgsSystemsV4Model.findOne(
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
                        // Populate the systemObject and historyObject
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
                                    system.state !== message.SystemFaction.FactionState.toLowerCase() ||
                                    system.security !== message.SystemSecurity.toLowerCase() ||
                                    system.population !== message.Population ||
                                    system.controlling_minor_faction !== message.SystemFaction.Name.toLowerCase() ||
                                    !system.conflicts ||
                                    !_.isEqual(_.sortBy(system.conflicts, ['faction1.name_lower']), _.sortBy(conflictsArray, ['faction1.name_lower'])) ||
                                    !_.isEqual(_.sortBy(system.factions, ['name_lower']), _.sortBy(factionArray, ['name_lower']))) {

                                    let timeNow = Date.now();
                                    let systemHistory = await ebgsHistorySystemV4Model.find({
                                        system_id: system._id,
                                        updated_at: {
                                            $lte: new Date(timeNow),
                                            $gte: new Date(timeNow - 172800000)
                                        }
                                    }).sort({ updated_at: -1 }).lean();
                                    if (this.checkSystemWHistory(message, systemHistory, factionArray, conflictsArray)) {
                                        systemObject.government = message.SystemGovernment;
                                        systemObject.allegiance = message.SystemAllegiance;
                                        systemObject.state = message.SystemFaction.FactionState;
                                        systemObject.security = message.SystemSecurity;
                                        systemObject.population = message.Population;
                                        systemObject.controlling_minor_faction = message.SystemFaction.Name;
                                        systemObject.factions = factionArray;
                                        systemObject.conflicts = conflictsArray;
                                        systemObject.updated_at = message.timestamp;

                                        historyObject.updated_at = message.timestamp;
                                        historyObject.updated_by = "EDDN";
                                        historyObject.government = message.SystemGovernment;
                                        historyObject.allegiance = message.SystemAllegiance;
                                        historyObject.state = message.SystemFaction.FactionState;
                                        historyObject.security = message.SystemSecurity;
                                        historyObject.population = message.Population;
                                        historyObject.controlling_minor_faction = message.SystemFaction.Name;
                                        historyObject.factions = factionArray;
                                        historyObject.conflicts = conflictsArray;
                                    } else {
                                        systemObject = {};
                                    }
                                } else {
                                    systemObject.updated_at = message.timestamp;
                                }
                            }
                            if (!system.system_address || !system.secondary_economy) {
                                systemObject.system_address = message.SystemAddress;
                                systemObject.secondary_economy = message.SystemSecondEconomy;
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
                                state: message.SystemFaction.FactionState,
                                security: message.SystemSecurity,
                                population: message.Population,
                                primary_economy: message.SystemEconomy,
                                secondary_economy: message.SystemSecondEconomy,
                                controlling_minor_faction: message.SystemFaction.Name,
                                factions: factionArray,
                                conflicts: conflictsArray,
                                updated_at: message.timestamp
                            };

                            historyObject = {
                                updated_at: message.timestamp,
                                updated_by: "EDDN",
                                government: message.SystemGovernment,
                                allegiance: message.SystemAllegiance,
                                state: message.SystemFaction.FactionState,
                                security: message.SystemSecurity,
                                population: message.Population,
                                controlling_minor_faction: message.SystemFaction.Name,
                                factions: factionArray,
                                conflicts: conflictsArray
                            };
                        }
                        // Do the actual db calls
                        if (!_.isEmpty(systemObject)) {
                            if (hasEddbId) {
                                try {
                                    let systemReturn = await ebgsSystemsV4Model.findOneAndUpdate(
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
                                    if (!_.isEmpty(historyObject)) {
                                        historyObject.system_id = systemReturn._id;
                                        historyObject.system_name_lower = systemReturn.name_lower;
                                        this.setSystemHistory(historyObject);
                                    }
                                } catch (err) {
                                    bugsnagCaller(err, {
                                        metaData: {
                                            message: message,
                                            systemObject: systemObject
                                        }
                                    });
                                }
                            } else {
                                try {
                                    let id = await eddbIdPromise;
                                    systemObject.eddb_id = id;
                                    try {
                                        let systemReturn = await ebgsSystemsV4Model.findOneAndUpdate(
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
                                            });
                                        if (!_.isEmpty(historyObject)) {
                                            historyObject.system_id = systemReturn._id;
                                            historyObject.system_name_lower = systemReturn.name_lower;
                                            this.setSystemHistory(historyObject);
                                        }
                                    } catch (err) {
                                        bugsnagCaller(err, {
                                            metaData: {
                                                message: message,
                                                systemObject: systemObject
                                            }
                                        });
                                    }
                                } catch (err) {       // If eddb id cannot be fetched, create the record without it.
                                    try {
                                        let systemReturn = await ebgsSystemsV4Model.findOneAndUpdate(
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
                                            });
                                        if (!_.isEmpty(historyObject)) {
                                            historyObject.system_id = systemReturn._id;
                                            historyObject.system_name_lower = systemReturn.name_lower;
                                            this.setSystemHistory(historyObject);
                                        }
                                    } catch (err) {
                                        bugsnagCaller(err, {
                                            metaData: {
                                                message: message,
                                                systemObject: systemObject
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        bugsnagCaller(err, {
                            metaData: {
                                message: message,
                                systemModel: ebgsSystemsV4Model
                            }
                        });
                    }
                })();
                (async () => {
                    try {
                        let messageFactionsLower = [];
                        message.Factions.forEach(faction => {
                            messageFactionsLower.push(faction.Name.toLowerCase());
                        });

                        let allFactionsPresentInSystem = ebgsFactionsV4Model.find(
                            {
                                faction_presence: {
                                    $elemMatch: { system_name_lower: message.StarSystem.toLowerCase() }
                                }
                            }
                        ).lean();

                        let allFactionsPresentInMessage = ebgsFactionsV4Model.find(
                            {
                                name_lower: {
                                    $in: messageFactionsLower
                                }
                            }
                        ).lean();

                        try {
                            let values = await Promise.all([allFactionsPresentInSystem, allFactionsPresentInMessage]);
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
                                for (let factionObject of factionsPresentInSystemDB) {
                                    if (factionNameLower === factionObject.name_lower && factionObject.updated_at < new Date(message.timestamp)) {
                                        let factionPresence = [];
                                        factionObject.faction_presence.forEach(system => {
                                            if (system.system_name_lower !== message.StarSystem.toLowerCase()) {
                                                factionPresence.push(system);
                                            }
                                        });
                                        factionObject.faction_presence = factionPresence;
                                        factionObject.updated_at = message.timestamp;

                                        if (!factionObject.eddb_id) {
                                            try {
                                                let id = await this.getFactionEDDBId(factionObject.name);
                                                factionObject.eddb_id = id;
                                                try {
                                                    ebgsFactionsV4Model.findOneAndUpdate(
                                                        {
                                                            name: factionObject.name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true
                                                        })
                                                        .exec();
                                                } catch (err) {
                                                    bugsnagCaller(err, {
                                                        metaData: {
                                                            message: message,
                                                            factionObject: factionObject
                                                        }
                                                    });
                                                }
                                            } catch (err) {
                                                try {
                                                    ebgsFactionsV4Model.findOneAndUpdate(
                                                        {
                                                            name: factionObject.name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true
                                                        })
                                                        .exec();
                                                } catch (err) {
                                                    bugsnagCaller(err, {
                                                        metaData: {
                                                            message: message,
                                                            factionObject: factionObject
                                                        }
                                                    });
                                                }
                                            }
                                        } else {
                                            try {
                                                ebgsFactionsV4Model.findOneAndUpdate(
                                                    {
                                                        name: factionObject.name
                                                    },
                                                    factionObject,
                                                    {
                                                        upsert: true,
                                                        runValidators: true
                                                    })
                                                    .exec();
                                            } catch (err) {
                                                bugsnagCaller(err, {
                                                    metaData: {
                                                        message: message,
                                                        factionObject: factionObject
                                                    }
                                                });
                                            }
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
                                        }
                                        let pendingStates = [];
                                        if (messageFaction.PendingStates) {
                                            messageFaction.PendingStates.forEach(pendingState => {
                                                let pendingStateObject = {
                                                    state: pendingState.State.toLowerCase(),
                                                    trend: pendingState.Trend
                                                };
                                                pendingStates.push(pendingStateObject);
                                            });
                                        }
                                        let recoveringStates = [];
                                        if (messageFaction.RecoveringStates) {
                                            messageFaction.RecoveringStates.forEach(recoveringState => {
                                                let recoveringStateObject = {
                                                    state: recoveringState.State.toLowerCase(),
                                                    trend: recoveringState.Trend
                                                };
                                                recoveringStates.push(recoveringStateObject);
                                            });
                                        }
                                        let conflictsArray = [];
                                        for (let conflict of message.Conflicts) {
                                            if (conflict.Faction1.Name.toLowerCase() === factionNameLower ||
                                                conflict.Faction2.Name.toLowerCase() === factionNameLower) {
                                                let opponent;
                                                let stake;
                                                let daysWon;
                                                if (conflict.Faction1.Name.toLowerCase() === factionNameLower) {
                                                    opponent = conflict.Faction2.Name;
                                                    stake = conflict.Faction1.Stake;
                                                    daysWon = +conflict.Faction1.WonDays;
                                                } else {
                                                    opponent = conflict.Faction1.Name;
                                                    stake = conflict.Faction2.Stake;
                                                    daysWon = +conflict.Faction2.WonDays;
                                                }
                                                let conflictObject = {
                                                    type: conflict.WarType,
                                                    status: conflict.Status,
                                                    opponent_name: opponent,
                                                    opponent_name_lower: opponent.toLowerCase(),
                                                    stake: stake,
                                                    stake_lower: stake.toLowerCase(),
                                                    days_won: daysWon
                                                };
                                                conflictsArray.push(conflictObject);
                                            }
                                        }

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
                                                conflicts: conflictsArray,
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
                                            conflicts: conflictsArray,
                                            systems: [{
                                                name: message.StarSystem,
                                                name_lower: message.StarSystem.toLowerCase()
                                            }]
                                        };
                                        try {
                                            let id = await this.getFactionEDDBId(messageFaction.Name);
                                            factionObject.eddb_id = id;
                                            try {
                                                let factionReturn = await ebgsFactionsV4Model.findOneAndUpdate(
                                                    {
                                                        name: factionObject.name
                                                    },
                                                    factionObject,
                                                    {
                                                        upsert: true,
                                                        runValidators: true,
                                                        new: true
                                                    });
                                                historyObject.faction_id = factionReturn._id;
                                                historyObject.faction_name = factionReturn.name;
                                                historyObject.faction_name_lower = factionReturn.name_lower;
                                                this.setFactionHistory(historyObject);
                                            } catch (err) {
                                                bugsnagCaller(err, {
                                                    metaData: {
                                                        message: message,
                                                        factionObject: factionObject
                                                    }
                                                });
                                            }
                                        } catch (err) {
                                            try {
                                                let factionReturn = await ebgsFactionsV4Model.findOneAndUpdate(
                                                    {
                                                        name: factionObject.name
                                                    },
                                                    factionObject,
                                                    {
                                                        upsert: true,
                                                        runValidators: true,
                                                        new: true
                                                    })
                                                historyObject.faction_id = factionReturn._id;
                                                historyObject.faction_name = factionReturn.name;
                                                historyObject.faction_name_lower = factionReturn.name_lower;
                                                this.setFactionHistory(historyObject);
                                            } catch (err) {
                                                bugsnagCaller(err, {
                                                    metaData: {
                                                        message: message,
                                                        factionObject: factionObject
                                                    }
                                                });
                                            }
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
                                        let conflicts = getDoFactionUpdate.conflicts;
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
                                                        conflicts: conflicts,
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
                                                    conflicts: conflicts,
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
                                                conflicts: conflicts,
                                                systems: systemHistory
                                            }
                                            if (!dbFaction.eddb_id) {
                                                try {
                                                    let id = await this.getFactionEDDBId(messageFaction.Name);
                                                    factionObject.eddb_id = id;
                                                    try {
                                                        let factionReturn = await ebgsFactionsV4Model.findOneAndUpdate(
                                                            {
                                                                name: messageFaction.Name
                                                            },
                                                            factionObject,
                                                            {
                                                                upsert: true,
                                                                runValidators: true,
                                                                new: true
                                                            });
                                                        historyObject.faction_id = factionReturn._id;
                                                        historyObject.faction_name = factionReturn.name;
                                                        historyObject.faction_name_lower = factionReturn.name_lower;
                                                        this.setFactionHistory(historyObject);
                                                    } catch (err) {
                                                        bugsnagCaller(err, {
                                                            metaData: {
                                                                message: message,
                                                                messageFaction: messageFaction,
                                                                factionObject: factionObject
                                                            }
                                                        });
                                                    }
                                                } catch (err) {
                                                    try {
                                                        let factionReturn = await ebgsFactionsV4Model.findOneAndUpdate(
                                                            {
                                                                name: messageFaction.Name
                                                            },
                                                            factionObject,
                                                            {
                                                                upsert: true,
                                                                runValidators: true,
                                                                new: true
                                                            });
                                                        historyObject.faction_id = factionReturn._id;
                                                        historyObject.faction_name = factionReturn.name;
                                                        historyObject.faction_name_lower = factionReturn.name_lower;
                                                        this.setFactionHistory(historyObject);
                                                    } catch (err) {
                                                        bugsnagCaller(err, {
                                                            metaData: {
                                                                message: message,
                                                                messageFaction: messageFaction,
                                                                factionObject: factionObject
                                                            }
                                                        });
                                                    }
                                                }
                                            } else {
                                                try {
                                                    let factionReturn = await ebgsFactionsV4Model.findOneAndUpdate(
                                                        {
                                                            name: messageFaction.Name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true,
                                                            new: true
                                                        })
                                                    historyObject.faction_id = factionReturn._id;
                                                    historyObject.faction_name = factionReturn.name;
                                                    historyObject.faction_name_lower = factionReturn.name_lower;
                                                    this.setFactionHistory(historyObject);
                                                } catch (err) {
                                                    bugsnagCaller(err, {
                                                        metaData: {
                                                            message: message,
                                                            messageFaction: messageFaction,
                                                            factionObject: factionObject
                                                        }
                                                    });
                                                }
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
                                                        conflicts: conflicts,
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
                                                    try {
                                                        ebgsFactionsV4Model.findOneAndUpdate(
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
                                                    } catch (err) {
                                                        bugsnagCaller(err, {
                                                            metaData: {
                                                                message: message,
                                                                messageFaction: messageFaction,
                                                                factionObject: factionObject
                                                            }
                                                        });
                                                    }
                                                } catch (err) {
                                                    try {
                                                        ebgsFactionsV4Model.findOneAndUpdate(
                                                            {
                                                                name: messageFaction.Name
                                                            },
                                                            factionObject,
                                                            {
                                                                upsert: true,
                                                                runValidators: true,
                                                                new: true
                                                            })
                                                            .exec();
                                                    } catch (err) {
                                                        bugsnagCaller(err, {
                                                            metaData: {
                                                                message: message,
                                                                messageFaction: messageFaction,
                                                                factionObject: factionObject
                                                            }
                                                        });
                                                    }
                                                }
                                            } else {
                                                try {
                                                    ebgsFactionsV4Model.findOneAndUpdate(
                                                        {
                                                            name: messageFaction.Name
                                                        },
                                                        factionObject,
                                                        {
                                                            upsert: true,
                                                            runValidators: true,
                                                            new: true
                                                        })
                                                        .exec();
                                                } catch (err) {
                                                    bugsnagCaller(err, {
                                                        metaData: {
                                                            message: message,
                                                            messageFaction: messageFaction,
                                                            factionObject: factionObject
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            bugsnagCaller(err, {
                                metaData: {
                                    message: message
                                }
                            });
                        }
                    } catch (err) {
                        bugsnagCaller(err, {
                            metaData: {
                                message: message,
                                factionModel: ebgsFactionsV4Model
                            }
                        });
                    }
                })();
            } catch (err) {
                if (err.message !== 'Message is not valid') {
                    bugsnagCaller(err, {
                        metaData: {
                            message: message
                        }
                    });
                }
            }
        }
        if (message.event === "Docked" || (message.event === "Location" && message.Docked)) {
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
                try {
                    let station = await ebgsStationsV4Model.findOne(
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
                            // Temporary fix
                            if (!station.distance_from_star) {
                                stationObject.distance_from_star = message.DistFromStarLS;
                            }
                            if (station.government !== message.StationGovernment.toLowerCase() ||
                                station.allegiance !== message.StationAllegiance.toLowerCase() ||
                                station.state !== message.StationFaction.FactionState.toLowerCase() ||
                                station.controlling_minor_faction !== message.StationFaction.Name.toLowerCase() ||
                                !_.isEqual(_.sortBy(station.services, ['name_lower']), _.sortBy(serviceArray, ['name_lower']))) {

                                let timeNow = Date.now();
                                let stationHistory = await ebgsHistoryStationV4Model.find({
                                    station_id: station._id,
                                    updated_at: {
                                        $lte: new Date(timeNow),
                                        $gte: new Date(timeNow - 172800000)
                                    }
                                }).sort({ updated_at: -1 }).lean();
                                if (this.checkStationWHistory(message, stationHistory, serviceArray)) {
                                    stationObject.government = message.StationGovernment;
                                    stationObject.allegiance = message.StationAllegiance;
                                    stationObject.state = message.StationFaction.FactionState;
                                    stationObject.controlling_minor_faction = message.StationFaction.Name;
                                    stationObject.services = serviceArray;
                                    stationObject.updated_at = message.timestamp;

                                    historyObject.updated_at = message.timestamp;
                                    historyObject.updated_by = "EDDN";
                                    historyObject.government = message.StationGovernment;
                                    historyObject.allegiance = message.StationAllegiance;
                                    historyObject.state = message.StationFaction.FactionState;
                                    historyObject.controlling_minor_faction = message.StationFaction.Name;
                                    historyObject.services = serviceArray;
                                } else {
                                    stationObject = {};
                                }
                            } else {
                                stationObject.updated_at = message.timestamp;
                            }
                        }
                        if (!station.market_id || !station.all_economies) {
                            stationObject.market_id = message.MarketID;
                            stationObject.all_economies = message.StationEconomies.map(economy => {
                                return {
                                    name: economy.Name,
                                    proportion: economy.Proportion
                                }
                            });
                        }
                    } else {
                        eddbIdPromise = this.getStationEDDBId(message.StationName);
                        stationObject = {
                            name: message.StationName,
                            name_lower: message.StationName.toLowerCase(),
                            market_id: message.MarketID,
                            system: message.StarSystem,
                            system_lower: message.StarSystem.toLowerCase(),
                            type: message.StationType,
                            government: message.StationGovernment,
                            economy: message.StationEconomy,
                            all_economies: message.StationEconomies.map(economy => {
                                return {
                                    name: economy.Name,
                                    proportion: economy.Proportion
                                }
                            }),
                            allegiance: message.StationAllegiance,
                            state: message.StationFaction.FactionState,
                            distance_from_star: message.DistFromStarLS,
                            controlling_minor_faction: message.StationFaction.Name,
                            services: serviceArray,
                            updated_at: message.timestamp,
                        };

                        historyObject = {
                            updated_at: message.timestamp,
                            updated_by: "EDDN",
                            government: message.StationGovernment,
                            allegiance: message.StationAllegiance,
                            state: message.StationFaction.FactionState,
                            controlling_minor_faction: message.StationFaction.Name,
                            services: serviceArray
                        };
                    }
                    if (!_.isEmpty(stationObject)) {
                        if (hasEddbId) {
                            try {
                                let stationReturn = await ebgsStationsV4Model.findOneAndUpdate(
                                    {
                                        name_lower: message.StationName.toLowerCase(),
                                        system_lower: message.StarSystem.toLowerCase()
                                    },
                                    stationObject,
                                    {
                                        upsert: true,
                                        runValidators: true,
                                        new: true
                                    });
                                if (!_.isEmpty(historyObject)) {
                                    historyObject.station_id = stationReturn._id;
                                    historyObject.station_name_lower = stationReturn.name_lower;
                                    this.setStationHistory(historyObject);
                                }
                            } catch (err) {
                                bugsnagCaller(err, {
                                    metaData: {
                                        message: message,
                                        stationObject: stationObject
                                    }
                                });
                            }
                        } else {
                            try {
                                let id = await eddbIdPromise;
                                stationObject.eddb_id = id;
                                try {
                                    let stationReturn = await ebgsStationsV4Model.findOneAndUpdate(
                                        {
                                            name_lower: message.StationName.toLowerCase(),
                                            system_lower: message.StarSystem.toLowerCase()
                                        },
                                        stationObject,
                                        {
                                            upsert: true,
                                            runValidators: true,
                                            new: true
                                        });
                                    if (!_.isEmpty(historyObject)) {
                                        historyObject.station_id = stationReturn._id;
                                        historyObject.station_name_lower = stationReturn.name_lower;
                                        this.setStationHistory(historyObject);
                                    }
                                } catch (err) {
                                    bugsnagCaller(err, {
                                        metaData: {
                                            message: message,
                                            stationObject: stationObject
                                        }
                                    });
                                }
                            } catch (err) {
                                try {
                                    let stationReturn = await ebgsStationsV4Model.findOneAndUpdate(
                                        {
                                            name_lower: message.StationName.toLowerCase(),
                                            system_lower: message.StarSystem.toLowerCase()
                                        },
                                        stationObject,
                                        {
                                            upsert: true,
                                            runValidators: true,
                                            new: true
                                        });
                                    if (!_.isEmpty(historyObject)) {
                                        historyObject.station_id = stationReturn._id;
                                        historyObject.station_name_lower = stationReturn.name_lower;
                                        this.setStationHistory(historyObject);
                                    }
                                } catch (err) {
                                    bugsnagCaller(err, {
                                        metaData: {
                                            message: message,
                                            stationObject: stationObject
                                        }
                                    });
                                }
                            }
                        }
                    }
                } catch (err) {
                    bugsnagCaller(err, {
                        metaData: {
                            message: message,
                            stationModel: ebgsStationsV4Model
                        }
                    });
                }
            } catch (err) {
                if (err.message !== 'Message is not valid') {
                    bugsnagCaller(err, {
                        metaData: {
                            message: message
                        }
                    });
                }
            }
        }
    }

    // Used in V3
    this.checkMessage = message => {
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

    // Used in V4 FSDJump
    this.checkMessage1 = async (message, header) => {
        if (
            message.StarSystem &&
            message.SystemFaction &&
            typeof message.SystemFaction !== 'string' && !(message.SystemFaction instanceof String) &&
            message.SystemAddress &&
            message.timestamp &&
            message.SystemSecurity &&
            message.SystemAllegiance &&
            message.SystemEconomy &&
            message.StarPos &&
            message.Factions &&
            message.event &&
            message.SystemGovernment
        ) {
            if (!message.SystemFaction.FactionState) {
                message.SystemFaction.FactionState = "None";
            }
            if (!message.Population) {
                message.Population = 0;
            }
            if (!message.Conflicts) {
                message.Conflicts = [];
            }
            let configRecord = await configModel.findOne({}).lean();
            if (configRecord.blacklisted_software.findIndex(software => {
                let regexp = new RegExp(software, "i");
                return regexp.test(header.softwareName);
            }) !== -1) {
                throw new Error("Message from blacklisted software " + header.softwareName);
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
                throw new Error("Message from old version " + header.softwareVersion + " software " + header.softwareName);
            }
            let messageTimestamp = new Date(message.timestamp);
            let oldestTimestamp = new Date("2017-10-07T00:00:00Z");
            let currentTimestamp = new Date(Date.now() + configRecord.time_offset);
            if (messageTimestamp < oldestTimestamp || messageTimestamp > currentTimestamp) {
                throw new Error("Message timestamp too old or in the future");
            } else {
                return;
            }
        } else {
            throw new Error("Message is not valid");
        }
    }

    // Used in V4 Docked
    this.checkMessage2 = async (message, header) => {
        if (
            message.StarSystem &&
            message.MarketID &&
            message.timestamp &&
            message.StarPos &&
            message.event &&
            message.DistFromStarLS &&
            message.StationEconomy &&
            message.StationEconomies &&
            message.StationFaction &&
            typeof message.StationFaction !== 'string' && !(message.StationFaction instanceof String) &&
            message.StationGovernment &&
            message.StationName &&
            message.StationServices &&
            message.StationType
        ) {
            if (message.StationType === "FleetCarrier") {
                throw new Error("Message from Fleet Carrier");
            }
            if (message.StationType === "MegaShip") {
                throw new Error("Message from Mega Ship");
            }
            if (nonBGSFactions.find(factionName => {
                return factionName.toLowerCase() === message.StationFaction.Name.toLowerCase();
            })) {
                throw new Error("Station owned by Non BGS Faction");
            }
            if (!message.StationFaction.FactionState) {
                message.StationFaction.FactionState = "None";
            }
            if (!message.StationAllegiance) {
                message.StationAllegiance = "Independent";
            }
            let configRecord = await configModel.findOne({}).lean();
            if (configRecord.blacklisted_software.findIndex(software => {
                let regexp = new RegExp(software, "i");
                return regexp.test(header.softwareName);
            }) !== -1) {
                throw new Error("Message from blacklisted software " + header.softwareName);
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
                throw new Error("Message from old version " + header.softwareVersion + " software " + header.softwareName);
            }
            let messageTimestamp = new Date(message.timestamp);
            let oldestTimestamp = new Date("2017-10-07T00:00:00Z");
            let currentTimestamp = new Date(Date.now() + configRecord.time_offset);
            if (messageTimestamp < oldestTimestamp || messageTimestamp > currentTimestamp) {
                throw new Error("Message timestamp too old or in the future");
            } else {
                return;
            }
        } else {
            throw new Error("Message is not valid");
        }
    }

    // Used in V4
    this.checkSystemWHistory = (message, history, factionArray, conflictsArray) => {
        for (let item of history) {
            if (item.government === message.SystemGovernment.toLowerCase() &&
                item.allegiance === message.SystemAllegiance.toLowerCase() &&
                item.state === message.SystemFaction.FactionState.toLowerCase() &&
                item.security === message.SystemSecurity.toLowerCase() &&
                item.population === message.Population &&
                item.controlling_minor_faction === message.SystemFaction.Name.toLowerCase() &&
                item.conflicts &&
                _.isEqual(_.sortBy(item.conflicts, ['faction1.name_lower']), _.sortBy(conflictsArray, ['faction1.name_lower'])) &&
                _.isEqual(_.sortBy(item.factions, ['name_lower']), _.sortBy(factionArray, ['name_lower']))) {
                return false;
            }
        }
        return true;
    }

    // Used in doFactionUpdate
    this.checkFactionWHistory = (message, messageFaction, history, activeStates, pendingStates, recoveringStates, conflicts) => {
        for (let item of history) {
            if (item.system_lower === message.StarSystem.toLowerCase() &&
                item.state === messageFaction.FactionState.toLowerCase() &&
                item.influence === messageFaction.Influence &&
                item.happiness === messageFaction.Happiness.toLowerCase() &&
                item.conflicts &&
                _.isEqual(_.sortBy(item.conflicts, ['opponent_name_lower']), _.sortBy(conflicts, ['opponent_name_lower'])) &&
                _.isEqual(_.sortBy(item.active_states, ['state']), _.sortBy(activeStates, ['state'])) &&
                _.isEqual(_.sortBy(item.pending_states, ['state']), _.sortBy(pendingStates, ['state'])) &&
                _.isEqual(_.sortBy(item.recovering_states, ['state']), _.sortBy(recoveringStates, ['state']))) {
                return false;
            }
        }
        return true;
    }

    // Used in V4
    this.checkStationWHistory = (message, history, serviceArray) => {
        for (let item of history) {
            if (item.government === message.StationGovernment.toLowerCase() &&
                item.allegiance === message.StationAllegiance.toLowerCase() &&
                item.state === message.StationFaction.FactionState.toLowerCase() &&
                item.controlling_minor_faction === message.StationFaction.Name.toLowerCase() &&
                _.isEqual(_.sortBy(item.services, ['name_lower']), _.sortBy(serviceArray, ['name_lower']))) {
                return false;
            }
        }
        return true;
    }

    // Used in V4
    this.doFactionUpdate = async (messageFaction, dbFaction, message) => {
        if (!messageFaction.Happiness || messageFaction.Happiness.length === 0) {
            return { pendingStates: [], recoveringStates: [], doUpdate: false, dontUpdateTime: true };
        }
        let activeStates = [];
        if (messageFaction.ActiveStates) {
            messageFaction.ActiveStates.forEach(activeState => {
                let activeStateObject = {
                    state: activeState.State.toLowerCase()
                };
                activeStates.push(activeStateObject);
            });
        }
        let pendingStates = [];
        if (messageFaction.PendingStates) {
            messageFaction.PendingStates.forEach(pendingState => {
                let pendingStateObject = {
                    state: pendingState.State.toLowerCase(),
                    trend: pendingState.Trend
                };
                pendingStates.push(pendingStateObject);
            });
        }
        let recoveringStates = [];
        if (messageFaction.RecoveringStates) {
            messageFaction.RecoveringStates.forEach(recoveringState => {
                let recoveringStateObject = {
                    state: recoveringState.State.toLowerCase(),
                    trend: recoveringState.Trend
                };
                recoveringStates.push(recoveringStateObject);
            });
        }
        let factionName = dbFaction.name_lower;
        let conflicts = [];
        if (message.Conflicts) {
            message.Conflicts.forEach(conflict => {
                if (conflict.Faction1.Name.toLowerCase() === factionName ||
                    conflict.Faction2.Name.toLowerCase() === factionName) {
                    let opponent;
                    let stake;
                    let daysWon;
                    if (conflict.Faction1.Name.toLowerCase() === factionName) {
                        opponent = conflict.Faction2.Name;
                        stake = conflict.Faction1.Stake;
                        daysWon = +conflict.Faction1.WonDays;
                    } else {
                        opponent = conflict.Faction1.Name;
                        stake = conflict.Faction2.Stake;
                        daysWon = +conflict.Faction2.WonDays;
                    }
                    let conflictObject = {
                        type: conflict.WarType,
                        status: conflict.Status,
                        opponent_name: opponent,
                        opponent_name_lower: opponent.toLowerCase(),
                        stake: stake,
                        stake_lower: stake.toLowerCase(),
                        days_won: daysWon
                    };
                    conflicts.push(conflictObject);
                }
            });
        }


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
                    faction.happiness === messageFaction.Happiness.toLowerCase() &&
                    faction.conflicts &&
                    _.isEqual(_.sortBy(faction.conflicts, ['opponent_name_lower']), _.sortBy(conflicts, ['opponent_name_lower'])) &&
                    _.isEqual(_.sortBy(faction.active_states, ['state']), _.sortBy(activeStates, ['state'])) &&
                    _.isEqual(_.sortBy(faction.pending_states, ['state']), _.sortBy(pendingStates, ['state'])) &&
                    _.isEqual(_.sortBy(faction.recovering_states, ['state']), _.sortBy(recoveringStates, ['state']))) {
                    doUpdate = false;
                } else {
                    let timeNow = Date.now();
                    let factionHistory = await ebgsHistoryFactionV4Model.find({
                        faction_id: dbFaction._id,
                        system_lower: faction.system_name_lower,
                        updated_at: {
                            $lte: new Date(timeNow),
                            $gte: new Date(timeNow - 172800000)
                        }
                    }).sort({ updated_at: -1 }).lean();
                    if (!this.checkFactionWHistory(message, messageFaction, factionHistory, activeStates, pendingStates, recoveringStates, conflicts)) {
                        doUpdate = false;
                        dontUpdateTime = true;
                    }
                }
            }
        }

        return { activeStates, pendingStates, recoveringStates, conflicts, doUpdate, dontUpdateTime }
    }

    // Used in V3 and V4
    this.correctCoordinates = value => {
        let floatValue = Number.parseFloat(value);
        let intValue = Math.round(floatValue * 32);
        return intValue / 32;
    }

    // Used in V3 and V4
    this.getSystemEDDBId = async name => {
        let requestOptions = {
            url: "https://eddbapi.kodeblox.com/api/v4/populatedsystems",
            qs: {
                name: name.toLowerCase()
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        if (response.statusCode === 200) {
            let responseObject = response.body;
            if (responseObject.total > 0) {
                return responseObject.docs[0].id;
            } else {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
    }

    // Used in V3 and V4
    this.getFactionEDDBId = async name => {
        let requestOptions = {
            url: "https://eddbapi.kodeblox.com/api/v4/factions",
            qs: {
                name: name.toLowerCase()
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        if (response.statusCode === 200) {
            let responseObject = response.body;
            if (responseObject.total > 0) {
                return responseObject.docs[0].id;
            } else {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
    }

    // Used in V4
    this.getStationEDDBId = async name => {
        let requestOptions = {
            url: "https://eddbapi.kodeblox.com/api/v4/stations",
            qs: {
                name: name.toLowerCase()
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        if (response.statusCode === 200) {
            let responseObject = response.body;
            if (responseObject.total > 0) {
                return responseObject.docs[0].id;
            } else {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
    }

    // Used in V4
    this.setSystemHistory = async historyObject => {
        let model = await ebgsHistorySystemV4Model;
        let document = new model(historyObject);
        await document.save();
        return;
    }

    // Used in V4
    this.setFactionHistory = async historyObject => {
        let model = await ebgsHistoryFactionV4Model;
        let document = new model(historyObject);
        await document.save();
        return;
    }

    // Used in V4
    this.setStationHistory = async historyObject => {
        let model = await ebgsHistoryStationV4Model;
        let document = new model(historyObject);
        await document.save();
        return;
    }
}
