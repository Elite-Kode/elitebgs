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
const mongoose = require('mongoose');
const cors = require('cors');
const _ = require('lodash');

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
 *       - name: primaryeconomy
 *         description: The primary economy of the system.
 *         in: query
 *         type: string
 *       - name: secondaryeconomy
 *         description: The secondary economy of the system.
 *         in: query
 *         type: string
 *       - name: faction
 *         description: The faction present in the system.
 *         in: query
 *         type: string
 *       - name: factionid
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
 *         description: Name of the active state of any faction in the system.
 *         in: query
 *         type: string
 *       - name: pendingState
 *         description: Name of the pending state of any faction in the system.
 *         in: query
 *         type: string
 *       - name: recoveringState
 *         description: Name of the recovering state of any faction in the system.
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
 *       - name: sphere
 *         description: Search by sphere instead of cube.
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
 *       - name: timemin
 *         description: Minimum time for the system history in miliseconds.
 *         in: query
 *         type: string
 *       - name: timemax
 *         description: Maximum time for the system history in miliseconds.
 *         in: query
 *         type: string
 *       - name: count
 *         description: Number of history records. Disables timemin and timemax
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
 *             $ref: '#/definitions/EBGSSystemsPageV4'
 */
router.get('/', cors(), async (req, res, next) => {
    try {
        let query = new Object;
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
        if (req.query.primaryeconomy) {
            query.primary_economy = utilities.arrayOrNot(req.query.primaryeconomy.toLowerCase(), _.toLower);
        }
        if (req.query.secondaryeconomy) {
            query.secondary_economy = utilities.arrayOrNot(req.query.secondaryeconomy.toLowerCase(), _.toLower);
        }
        if (req.query.faction) {
            query["factions"] = {
                $elemMatch: {
                    name_lower: utilities.arrayOrNot(req.query.faction, _.toLower)
                }
            };
        }
        if (req.query.factionid) {
            query["factions"] = {
                $elemMatch: {
                    faction_id: utilities.arrayOrNot(req.query.factionid, ObjectId)
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
            res.status(200).json(result);
        } else {
            let result = await getSystems(query, {}, minimal, page, req);
            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});

async function getSystems(query, history, minimal, page, request) {
    let referenceDistance = 20;
    let systemModel = await require('../../../models/ebgs_systems_v5');
    let aggregate = systemModel.aggregate().option(aggregateOptions);
    let countAggregate = systemModel.aggregate().option(aggregateOptions);
    if (request.query.referenceSystem || request.query.referenceSystemId) {
        if (request.query.referenceDistance) {
            referenceDistance = request.query.referenceDistance;
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
    }

    aggregate.match(query);
    countAggregate.match(query);

    if (!_.isEmpty(history)) {
        if (minimal === 'true') {
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
                            system_name_lower: 0
                        }
                    },
                    {
                        $limit: history.count
                    }
                ]
            });
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
                            system_name_lower: 0
                        }
                    }
                ]
            });
        }
    }

    let spherePipeline = {};

    if (request.query.referenceSystem) {
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
                    $lte: +referenceDistance
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

    let detailsLookup = {};
    let detailsAddFields = {};

    if (request.query.activeState || request.query.pendingState || request.query.recoveringState || request.query.factionDetails === 'true') {
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

    let stateQuery = {};

    if (request.query.activeState || request.query.pendingState || request.query.recoveringState) {
        let stateAddFieldsPipeline = {
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
            }
        };
        aggregate.addFields(stateAddFieldsPipeline);
        countAggregate.lookup(detailsLookup).addFields(detailsAddFields).addFields(stateAddFieldsPipeline);

        if (request.query.activeState) {
            stateQuery["active_states"] = {
                $elemMatch: utilities.arrayOrNot(request.query.activeState.toLowerCase(), _.toLower, true)
            };
        }
        if (request.query.pendingState) {
            stateQuery["pending_states"] = {
                $elemMatch: utilities.arrayOrNot(request.query.pendingState.toLowerCase(), _.toLower, true)
            };
        }
        if (request.query.recoveringState) {
            stateQuery["recovering_states"] = {
                $elemMatch: utilities.arrayOrNot(request.query.recoveringState.toLowerCase(), _.toLower, true)
            };
        }
        aggregate.match(stateQuery);
        countAggregate.match(stateQuery);

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

    if (minimal === 'true') {
        aggregate.project({
            factions: 0,
            conflicts: 0
        });
    }

    aggregate.project({
        faction_details: 0
    });

    if (_.isEmpty(query) && _.isEmpty(spherePipeline) && _.isEmpty(stateQuery)) {
        throw new Error("Add at least 1 query parameter to limit traffic");
    }

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
