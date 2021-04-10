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

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const _ = require('lodash');

const redisCache = require('../../../modules/utilities/rediscache');
const crypto = require('crypto');

const utilities = require('../../../modules/utilities');

let router = express.Router();
let ObjectId = mongoose.Types.ObjectId;
let recordsPerPage = 10;
let aggregateOptions = {
    maxTimeMS: 60000
}

/**
 * @swagger
 * /systems:
 *   get:
 *     description: Get the Systems
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID of the document.
 *         in: query
 *         type: string
 *       - name: eddbId
 *         description: EDDB ID of the system.
 *         in: query
 *         type: string
 *       - name: name
 *         description: System name.
 *         in: query
 *         type: string
 *       - name: allegiance
 *         description: Name of the allegiance.
 *         in: query
 *         type: string
 *       - name: government
 *         description: Name of the government type.
 *         in: query
 *         type: string
 *       - name: state
 *         description: State the system is in.
 *         in: query
 *         type: string
 *       - name: primaryEconomy
 *         description: The primary economy of the system.
 *         in: query
 *         type: string
 *       - name: secondaryEconomy
 *         description: The secondary economy of the system.
 *         in: query
 *         type: string
 *       - name: faction
 *         description: The faction present in the system.
 *         in: query
 *         type: string
 *       - name: factionId
 *         description: The id of the faction present in the system.
 *         in: query
 *         type: string
 *       - name: factionControl
 *         description: The faction is in control present in the system.
 *         in: query
 *         type: boolean
 *       - name: security
 *         description: The name of the security status in the system.
 *         in: query
 *         type: string
 *       - name: activeState
 *         description: (slow) Name of the active state of any faction in the system.
 *         in: query
 *         type: string
 *       - name: pendingState
 *         description: (slow) Name of the pending state of any faction in the system.
 *         in: query
 *         type: string
 *       - name: recoveringState
 *         description: (slow) Name of the recovering state of any faction in the system.
 *         in: query
 *         type: string
 *       - name: influenceGT
 *         description: (slow) Faction present with influence greater than. Must be between 0 and 1.
 *         in: query
 *         type: string
 *       - name: influenceLT
 *         description: (slow) Faction present with influence lesser than. Must be between 0 and 1.
 *         in: query
 *         type: string
 *       - name: factionAllegiance
 *         description: (slow) Faction present with allegiance.
 *         in: query
 *         type: string
 *       - name: factionGovernment
 *         description: (slow) Faction present with government.
 *         in: query
 *         type: string
 *       - name: referenceSystem
 *         description: The system centred around which the search should be made.
 *         in: query
 *         type: string
 *       - name: referenceSystemId
 *         description: The system id centred around which the search should be made.
 *         in: query
 *         type: string
 *       - name: referenceDistance
 *         description: The distance from the system centred around which the search should be made.
 *         in: query
 *         type: string
 *       - name: referenceDistanceMin
 *         description: The minimum distance from the system centred around which the search should be made.
 *         in: query
 *         type: string
 *       - name: sphere
 *         description: (slow) Search by sphere instead of cube.
 *         in: query
 *         type: boolean
 *       - name: beginsWith
 *         description: Starting characters of the system.
 *         in: query
 *         type: string
 *       - name: minimal
 *         description: Get minimal data of the system.
 *         in: query
 *         type: boolean
 *       - name: factionDetails
 *         description: Get the detailed faction data of the factions in the system.
 *         in: query
 *         type: boolean
 *       - name: factionHistory
 *         description: Get the history of the factions along with the system history.
 *         in: query
 *         type: boolean
 *       - name: timeMin
 *         description: Minimum time for the system history in milliseconds.
 *         in: query
 *         type: string
 *       - name: timeMax
 *         description: Maximum time for the system history in milliseconds.
 *         in: query
 *         type: string
 *       - name: count
 *         description: Number of history records. Disables timeMin and timeMax
 *         in: query
 *         type: string
 *       - name: page
 *         description: Page no of response.
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of systems with historical data
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/EBGSSystemsPageV5'
 */
router.get('/', cors(), async (req, res, next) => {
    // SHA 256 is a strong hash function that will produce unique hashes on even similar URLs
    let urlHash = crypto.createHash('sha256').update(req.originalUrl).digest("hex")

    // Check the in memory object cache for the URL
    const systemData = await redisCache.objCache.getKey(urlHash)
    if (systemData != null) {
        res.status(200).send(JSON.parse(systemData));
        return
    }

    try {
        let query = {};
        let page = 1;
        let history = false;
        let minimal = false;
        let greaterThanTime;
        let lesserThanTime;
        let count;

        if (req.query.id) {
            query._id = utilities.arrayOrNot(req.query.id, ObjectId);
        }
        if (req.query.eddbId) {
            query.eddb_id = utilities.arrayOrNot(req.query.eddbId, parseInt);
        }
        if (req.query.name) {
            query.name_lower = utilities.arrayOrNot(req.query.name, _.toLower);
        }
        if (req.query.allegiance) {
            query.allegiance = utilities.arrayOrNot(req.query.allegiance, _.toLower);
        }
        if (req.query.government) {
            query.government = utilities.arrayOrNot(req.query.government, _.toLower);
        }
        if (req.query.state) {
            query.state = utilities.arrayOrNot(req.query.state, _.toLower);
        }
        if (req.query.primaryEconomy) {
            query.primary_economy = utilities.arrayOrNot(req.query.primaryEconomy.toLowerCase(), _.toLower);
        }
        if (req.query.secondaryEconomy) {
            query.secondary_economy = utilities.arrayOrNot(req.query.secondaryEconomy.toLowerCase(), _.toLower);
        }
        if (req.query.faction) {
            query["factions"] = {
                $elemMatch: {
                    name_lower: utilities.arrayOrNot(req.query.faction, _.toLower)
                }
            };
        }
        if (req.query.factionId) {
            query["factions"] = {
                $elemMatch: {
                    faction_id: utilities.arrayOrNot(req.query.factionId, ObjectId)
                }
            };
        }
        if (req.query.factionControl === 'true') {
            query.controlling_minor_faction = utilities.arrayOrNot(req.query.faction, _.toLower);
        }
        if (req.query.security) {
            query.security = utilities.arrayOrNot(req.query.security.toLowerCase(), _.toLower);
        }
        if (req.query.beginsWith || (req.query.beginsWith === "" && req.query.page)) {
            query.name_lower = {
                $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`)
            };
        }
        if (req.query.minimal === 'true') {
            minimal = true;
        }
        if (+req.query.referenceDistanceMin && +req.query.referenceDistanceMin !== 0) {
            if (+req.query.referenceDistance > +req.query.referenceDistanceMin + 10) {
                throw new Error("referenceDistance cannot be more than 10 LY of referenceDistanceMin");
            }
        } else {
            if (+req.query.referenceDistance > 30) {
                throw new Error("referenceDistance cannot be more than 30 LY. Use referenceDistanceMin to calculate a shell");
            }
        }
        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.timeMin && req.query.timeMax) {
            history = true;
            greaterThanTime = new Date(Number(req.query.timeMin));
            lesserThanTime = new Date(Number(req.query.timeMax));
        }
        if (req.query.timeMin && !req.query.timeMax) {
            history = true;
            greaterThanTime = new Date(Number(req.query.timeMin));
            lesserThanTime = new Date(Number(+req.query.timeMin + 604800000));      // Adding seven days worth of milliseconds
        }
        if (!req.query.timeMin && req.query.timeMax) {
            history = true;
            greaterThanTime = new Date(Number(+req.query.timeMax - 604800000));     // Subtracting seven days worth of milliseconds
            lesserThanTime = new Date(Number(req.query.timeMax));
        }
        if (req.query.count) {
            history = true
            count = +req.query.count
        }
        if (history) {
            let result = await getSystems(query, {
                greater: greaterThanTime,
                lesser: lesserThanTime,
                count: count
            }, minimal, page, req);

            // Store the result in redis
            redisCache.objCache.setKey(urlHash, JSON.stringify(result))

            res.status(200).json(result);
        } else {
            let result = await getSystems(query, {}, minimal, page, req);

            // Store the result in redis
            redisCache.objCache.setKey(urlHash, JSON.stringify(result))

            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});

async function getSystems(query, history, minimal, page, request) {
    let referenceDistance = 20;
    let referenceDistanceMin = 0;
    let systemModel = require('../../../models/ebgs_systems_v5');
    let aggregate = systemModel.aggregate().option(aggregateOptions);
    let countAggregate = systemModel.aggregate().option(aggregateOptions);
    if (request.query.referenceSystem || request.query.referenceSystemId) {
        if (request.query.referenceDistance) {
            referenceDistance = request.query.referenceDistance;
        }

        if (request.query.referenceDistanceMin) {
            referenceDistanceMin = request.query.referenceDistanceMin;
        }

        let lookupPipeline = {};

        if (request.query.referenceSystem) {
            lookupPipeline = {
                from: "ebgssystemv5",
                as: "referenceSystem",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$name_lower", request.query.referenceSystem.toLowerCase()]
                            }
                        }
                    }
                ]
            };
        } else if (request.query.referenceSystemId) {
            lookupPipeline = {
                from: "ebgssystemv5",
                as: "referenceSystem",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", ObjectId(request.query.referenceSystemId)]
                            }
                        }
                    }
                ]
            };
        }

        let addFieldsPipeline = {
            referenceSystem: {
                $arrayElemAt: ["$referenceSystem", 0]
            }
        };

        aggregate.lookup(lookupPipeline).addFields(addFieldsPipeline);
        countAggregate.lookup(lookupPipeline).addFields(addFieldsPipeline);

        query["$expr"] = {
            $and: [
                {
                    $gt: [
                        "$x",
                        {
                            $subtract: ["$referenceSystem.x", +referenceDistance]
                        }
                    ]
                },
                {
                    $lt: [
                        "$x",
                        {
                            $add: ["$referenceSystem.x", +referenceDistance]
                        }
                    ]
                },
                {
                    $gt: [
                        "$y",
                        {
                            $subtract: ["$referenceSystem.y", +referenceDistance]
                        }
                    ]
                },
                {
                    $lt: [
                        "$y",
                        {
                            $add: ["$referenceSystem.y", +referenceDistance]
                        }
                    ]
                },
                {
                    $gt: [
                        "$z",
                        {
                            $subtract: ["$referenceSystem.z", +referenceDistance]
                        }
                    ]
                },
                {
                    $lt: [
                        "$z",
                        {
                            $add: ["$referenceSystem.z", +referenceDistance]
                        }
                    ]
                }
            ]
        }

        if (request.query.sphere !== 'true' && request.query.referenceDistanceMin) {
            query["$expr"]["$and"].push({
                $not: {
                    $and: [
                        {
                            $gt: [
                                "$x",
                                {
                                    $subtract: ["$referenceSystem.x", +referenceDistanceMin]
                                }
                            ]
                        },
                        {
                            $lt: [
                                "$x",
                                {
                                    add: ["$referenceSystem.x", +referenceDistanceMin]
                                }
                            ]
                        },
                        {
                            $gt: [
                                "$y",
                                {
                                    $subtract: ["$referenceSystem.y", +referenceDistanceMin]
                                }
                            ]
                        },
                        {
                            $lt: [
                                "$y",
                                {
                                    $add: ["$referenceSystem.y", +referenceDistanceMin]
                                }
                            ]
                        },
                        {
                            $gt: [
                                "$z",
                                {
                                    $subtract: ["$referenceSystem.z", +referenceDistanceMin]
                                }
                            ]
                        },
                        {
                            $lt: [
                                "$z",
                                {
                                    $add: ["$referenceSystem.z", +referenceDistanceMin]
                                }
                            ]
                        }
                    ]
                }
            });
        }
    }

    aggregate.match(query);
    countAggregate.match(query);

    let spherePipeline = {};

    if (request.query.referenceSystem || request.query.referenceSystemId) {
        let addFieldsPipeline = {
            distanceFromReferenceSystem: {
                $sqrt: {
                    $add: [
                        {
                            $pow: [
                                {
                                    $subtract: ["$x", "$referenceSystem.x"]
                                },
                                2
                            ]
                        },
                        {
                            $pow: [
                                {
                                    $subtract: ["$y", "$referenceSystem.y"]
                                },
                                2
                            ]
                        },
                        {
                            $pow: [
                                {
                                    $subtract: ["$z", "$referenceSystem.z"]
                                },
                                2
                            ]
                        }
                    ]
                }
            }
        };
        aggregate.addFields(addFieldsPipeline);
        countAggregate.addFields(addFieldsPipeline);

        if (request.query.sphere === 'true') {
            spherePipeline = {
                distanceFromReferenceSystem: {
                    $lte: +referenceDistance,
                    $gte: +referenceDistanceMin
                }
            };
            aggregate.match(spherePipeline);
            countAggregate.match(spherePipeline);
        }

        aggregate.project({
            referenceSystem: 0
        }).sort({
            distanceFromReferenceSystem: 1
        });
    }

    if (!_.isEmpty(history)) {
        if (minimal) {
            throw new Error("Minimal cannot work with History");
        }
        let lookupMatchAndArray = [{
            $eq: ["$system_id", "$$id"]
        }];
        if (history.count) {
            aggregate.lookup({
                from: "ebgshistorysystemv5",
                as: "history",
                let: { "id": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: lookupMatchAndArray
                            }
                        }
                    },
                    {
                        $project: {
                            system_id: 0,
                            system_name: 0,
                            system_name_lower: 0
                        }
                    },
                    {
                        $limit: history.count
                    }
                ]
            });
            if (request.query.factionHistory === 'true') {
                aggregate.lookup({
                    from: "ebgshistoryfactionv5",
                    as: "faction_history",
                    let: { "id": "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: lookupMatchAndArray
                                }
                            }
                        },
                        {
                            $sort: {
                                faction_id: 1.0,
                                updated_at: -1.0
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    faction_id: "$faction_id"
                                },
                                docs: {
                                    $push: "$$ROOT"
                                }
                            }
                        },
                        {
                            $project: {
                                top: {
                                    "$slice": ["$docs", history.count]
                                }
                            }
                        },
                        {
                            $unwind: {
                                path: "$top"
                            }
                        },
                        {
                            $replaceRoot: {
                                newRoot: "$top"
                            }
                        },
                        {
                            $project: {
                                system_id: 0,
                                system: 0,
                                system_lower: 0
                            }
                        }
                    ]
                });
            }
        } else {
            lookupMatchAndArray.push(
                {
                    $gte: ["$updated_at", new Date(history.greater)]
                },
                {
                    $lte: ["$updated_at", new Date(history.lesser)]
                }
            );

            aggregate.lookup({
                from: "ebgshistorysystemv5",
                as: "history",
                let: { "id": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: lookupMatchAndArray
                            }
                        }
                    },
                    {
                        $project: {
                            system_id: 0,
                            system_name: 0,
                            system_name_lower: 0
                        }
                    }
                ]
            });
            if (request.query.factionHistory === 'true') {
                aggregate.lookup({
                    from: "ebgshistoryfactionv5",
                    as: "faction_history",
                    let: { "id": "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: lookupMatchAndArray
                                }
                            }
                        },
                        {
                            $project: {
                                system_id: 0,
                                system: 0,
                                system_lower: 0
                            }
                        }
                    ]
                });
            }
        }
    }

    // Optimisation not working when deployed on server. Always returning only 10 records total.

    // if (!request.query.activeState && !request.query.pendingState && !request.query.recoveringState
    //     && !request.query.influenceGT && !request.query.influenceLT
    //     && !request.query.factionAllegiance && !request.query.factionGovernment) {
    //     aggregate.skip((page - 1) * recordsPerPage).limit(recordsPerPage);  // Optimisation for limit and skip when filters on lookups are not present
    // }

    let detailsLookup = {};
    let detailsAddFields = {};

    if (request.query.activeState || request.query.pendingState || request.query.recoveringState
        || request.query.influenceGT || request.query.influenceLT
        || request.query.factionAllegiance || request.query.factionGovernment
        || request.query.factionDetails === 'true') {
        detailsLookup = {
            from: "ebgsfactionv5",
            as: "faction_details",
            let: {
                faction_ids: {
                    $map: {
                        input: "$factions",
                        in: "$$this.faction_id"
                    }
                }
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$_id", "$$faction_ids"]
                        }
                    }
                }
            ]
        };

        detailsAddFields = {
            faction_details: {
                $map: {
                    input: "$faction_details",
                    as: "faction_info",
                    in: {
                        $mergeObjects: [
                            "$$faction_info",
                            {
                                faction_presence: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$$faction_info.faction_presence",
                                                as: "faction",
                                                cond: {
                                                    $eq: ["$$faction.system_id", "$_id"]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        };

        aggregate.lookup(detailsLookup).addFields(detailsAddFields);
    }

    let metadataQuery = {};

    if (request.query.activeState || request.query.pendingState || request.query.recoveringState
        || request.query.influenceGT || request.query.influenceLT
        || request.query.factionAllegiance || request.query.factionGovernment) {
        let metadataAddFieldsPipeline = {
            active_states: {
                $reduce: {
                    input: {
                        $map: {
                            input: "$faction_details",
                            as: "faction_info",
                            in: {
                                $map: {
                                    input: "$$faction_info.faction_presence.active_states",
                                    as: "state_object",
                                    in: "$$state_object.state"
                                }
                            }
                        }
                    },
                    initialValue: [],
                    in: {
                        $concatArrays: ["$$value", "$$this"]
                    }
                }
            },
            pending_states: {
                $reduce: {
                    input: {
                        $map: {
                            input: "$faction_details",
                            as: "faction_info",
                            in: {
                                $map: {
                                    input: "$$faction_info.faction_presence.pending_states",
                                    as: "state_object",
                                    in: "$$state_object.state"
                                }
                            }
                        }
                    },
                    initialValue: [],
                    in: {
                        $concatArrays: ["$$value", "$$this"]
                    }
                }
            },
            recovering_states: {
                $reduce: {
                    input: {
                        $map: {
                            input: "$faction_details",
                            as: "faction_info",
                            in: {
                                $map: {
                                    input: "$$faction_info.faction_presence.recovering_states",
                                    as: "state_object",
                                    in: "$$state_object.state"
                                }
                            }
                        }
                    },
                    initialValue: [],
                    in: {
                        $concatArrays: ["$$value", "$$this"]
                    }
                }
            },
            influences: {
                $map: {
                    input: "$faction_details",
                    as: "faction_info",
                    in: "$$faction_info.faction_presence.influence"
                }
            },
            faction_allegiances: {
                $map: {
                    input: "$faction_details",
                    as: "faction_info",
                    in: "$$faction_info.faction_presence.allegiance"
                }
            },
            faction_governments: {
                $map: {
                    input: "$faction_details",
                    as: "faction_info",
                    in: "$$faction_info.faction_presence.government"
                }
            }
        };
        aggregate.addFields(metadataAddFieldsPipeline);
        countAggregate.lookup(detailsLookup).addFields(detailsAddFields).addFields(metadataAddFieldsPipeline);

        if (request.query.activeState) {
            metadataQuery["active_states"] = {
                $elemMatch: utilities.arrayOrNot(request.query.activeState.toLowerCase(), _.toLower, true)
            };
        }
        if (request.query.pendingState) {
            metadataQuery["pending_states"] = {
                $elemMatch: utilities.arrayOrNot(request.query.pendingState.toLowerCase(), _.toLower, true)
            };
        }
        if (request.query.recoveringState) {
            metadataQuery["recovering_states"] = {
                $elemMatch: utilities.arrayOrNot(request.query.recoveringState.toLowerCase(), _.toLower, true)
            };
        }
        if (request.query.influenceGT || request.query.influenceLT) {
            metadataQuery["influences"] = {
                $gt: +request.query.influenceGT,
                $lt: +request.query.influenceLT
            };
        }
        if (request.query.influenceGT && request.query.influenceLT) {
            metadataQuery["influences"] = {
                $gt: +request.query.influenceGT,
                $lt: +request.query.influenceLT
            };
        } else if (request.query.influenceLT) {
            metadataQuery["influences"] = {
                $lt: +request.query.influenceLT
            };
        } else if (request.query.influenceGT) {
            metadataQuery["influences"] = {
                $gt: +request.query.influenceGT
            };
        }
        if (request.query.factionAllegiance) {
            metadataQuery["faction_allegiances"] = {
                $elemMatch: utilities.arrayOrNot(request.query.factionAllegiance.toLowerCase(), _.toLower, true)
            };
        }
        if (request.query.factionGovernment) {
            metadataQuery["faction_governments"] = {
                $elemMatch: utilities.arrayOrNot(request.query.factionGovernment.toLowerCase(), _.toLower, true)
            };
        }
        aggregate.match(metadataQuery);
        countAggregate.match(metadataQuery);

        aggregate.project({
            active_states: 0,
            pending_states: 0,
            recovering_states: 0
        });
    }

    let objectToMerge = {};

    if (request.query.factionDetails === 'true') {
        objectToMerge["faction_details"] = {
            $arrayElemAt: [
                {
                    $filter: {
                        input: "$faction_details",
                        as: "faction",
                        cond: {
                            $eq: ["$$faction._id", "$$faction_list.faction_id"]
                        }
                    }
                },
                0
            ]
        };
    }

    aggregate.addFields({
        factions: {
            $map: {
                input: "$factions",
                as: "faction_list",
                in: {
                    $mergeObjects: [
                        "$$faction_list",
                        objectToMerge
                    ]
                }
            }
        }
    });

    if (minimal) {
        aggregate.project({
            factions: 0,
            conflicts: 0
        });
    }

    aggregate.project({
        faction_details: 0
    });

    if (_.isEmpty(query) && _.isEmpty(spherePipeline) && _.isEmpty(metadataQuery)) {
        throw new Error("Add at least 1 query parameter to limit traffic");
    }

    aggregate.allowDiskUse(true);

    return systemModel.aggregatePaginate(aggregate, {
        page,
        countQuery: countAggregate,
        limit: recordsPerPage,
        customLabels: {
            totalDocs: "total",
            totalPages: "pages"
        }
    });
}

module.exports = router;
