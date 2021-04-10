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
 * /factions:
 *   get:
 *     description: Get the Factions
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID of the document.
 *         in: query
 *         type: string
 *       - name: eddbId
 *         description: EDDB ID of the faction.
 *         in: query
 *         type: string
 *       - name: name
 *         description: Faction name.
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
 *       - name: beginsWith
 *         description: Starting characters of the faction.
 *         in: query
 *         type: string
 *       - name: system
 *         description: Filter by system.
 *         in: query
 *         type: string
 *       - name: systemId
 *         description: Filter by system id.
 *         in: query
 *         type: string
 *       - name: filterSystemInHistory
 *         description: Apply the system filter in the history too.
 *         in: query
 *         type: boolean
 *       - name: activeState
 *         description: Name of the active state of the faction.
 *         in: query
 *         type: string
 *       - name: pendingState
 *         description: Name of the pending state of the faction.
 *         in: query
 *         type: string
 *       - name: recoveringState
 *         description: Name of the recovering state of the faction.
 *         in: query
 *         type: string
 *       - name: influenceGT
 *         description: Factions with influence greater than. Must be between 0 and 1.
 *         in: query
 *         type: string
 *       - name: influenceLT
 *         description: Factions with influence lesser than. Must be between 0 and 1.
 *         in: query
 *         type: string
 *       - name: minimal
 *         description: Get minimal data of the faction.
 *         in: query
 *         type: boolean
 *       - name: systemDetails
 *         description: Get the detailed system data the faction currently is in.
 *         in: query
 *         type: boolean
 *       - name: timeMin
 *         description: Minimum time for the faction history in milliseconds.
 *         in: query
 *         type: string
 *       - name: timeMax
 *         description: Maximum time for the faction history in milliseconds.
 *         in: query
 *         type: string
 *       - name: count
 *         description: Number of history records per system presence. Disables timeMin and timeMax
 *         in: query
 *         type: string
 *       - name: page
 *         description: Page no of response.
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of factions with historical data
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/EBGSFactionsPageV5'
 */
router.get('/', cors(), async (req, res, next) => {
    // SHA 256 is a strong hash function that will produce unique hashes on even similar URLs
    let urlHash = crypto.createHash('sha256').update(req.originalUrl).digest("hex")

    // Check the in memory object cache for the URL
    const factionData = await redisCache.objCache.getKey(urlHash)
    if (factionData != null) {
        res.status(200).send(JSON.parse(factionData));
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
        if (req.query.beginsWith || (req.query.beginsWith === "" && req.query.page)) {
            query.name_lower = {
                $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`)
            };
        }
        if (req.query.system) {
            query["faction_presence.system_name_lower"] = utilities.arrayOrNot(req.query.system, _.toLower);
        }
        if (req.query.systemId) {
            query["faction_presence.system_id"] = utilities.arrayOrNot(req.query.system, ObjectId);
        }
        if (req.query.activeState) {
            query["faction_presence"] = {
                $elemMatch: {
                    active_states: {
                        $elemMatch: {
                            state: utilities.arrayOrNot(req.query.activeState, _.toLower)
                        }
                    }
                }
            };
        }
        if (req.query.pendingState) {
            query["faction_presence"] = {
                $elemMatch: {
                    pending_states: {
                        $elemMatch: {
                            state: utilities.arrayOrNot(req.query.pendingState, _.toLower)
                        }
                    }
                }
            };
        }
        if (req.query.recoveringState) {
            query["faction_presence"] = {
                $elemMatch: {
                    recovering_states: {
                        $elemMatch: {
                            state: utilities.arrayOrNot(req.query.recoveringState, _.toLower)
                        }
                    }
                }
            };
        }
        if (req.query.influenceGT && req.query.influenceGT) {
            query["faction_presence"] = {
                $elemMatch: {
                    influence: {
                        $gt: +request.query.influenceGT,
                        $lt: +request.query.influenceLT
                    }
                }
            };
        } else if (req.query.influenceGT) {
            query["faction_presence"] = {
                $elemMatch: {
                    influence: {
                        $gt: +request.query.influenceGT
                    }
                }
            };
        } else if (req.query.influenceLT) {
            query["faction_presence"] = {
                $elemMatch: {
                    influence: {
                        $gt: +request.query.influenceLT,
                    }
                }
            };
        }
        if (req.query.minimal === 'true') {
            minimal = true;
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
            let result = await getFactions(query, {
                greater: greaterThanTime,
                lesser: lesserThanTime,
                count: count
            }, minimal, page, req);

            // Store the result in redis
            redisCache.objCache.setKey(urlHash, JSON.stringify(result))

            res.status(200).json(result);
        } else {
            let result = await getFactions(query, {}, minimal, page, req);

            // Store the result in redis
            redisCache.objCache.setKey(urlHash, JSON.stringify(result))

            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});

async function getFactions(query, history, minimal, page, request) {
    let factionModel = require('../../../models/ebgs_factions_v5');
    let aggregate = factionModel.aggregate().option(aggregateOptions);
    aggregate.match(query).addFields({
        system_ids: {
            $map: {
                input: "$faction_presence",
                as: "system_info",
                in: "$$system_info.system_id"
            }
        }
    });

    let countAggregate = factionModel.aggregate().option(aggregateOptions);
    countAggregate.match(query);

    if (!_.isEmpty(history)) {
        if (minimal) {
            throw new Error("Minimal cannot work with History");
        }
        let lookupMatchAndArray = [{
            $eq: ["$faction_id", "$$id"]
        }];
        if (history.count) {
            if (request.query.system && request.query.filterSystemInHistory === 'true') {
                lookupMatchAndArray.push(query.faction_presence.system_name_lower);
            } else if (request.query.systemId && request.query.filterSystemInHistory === 'true') {
                lookupMatchAndArray.push(query.faction_presence.system_id);
            } else {
                lookupMatchAndArray.push({
                    $in: ["$system_id", "$$system_id"]
                });
            }
            aggregate.lookup({
                from: "ebgshistoryfactionv5",
                as: "history",
                let: { "id": "$_id", "system_id": "$system_ids" },
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
                            system_id: 1.0,
                            updated_at: -1.0
                        }
                    },
                    {
                        $group: {
                            _id: {
                                system_id: "$system_id"
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
                            faction_id: 0,
                            faction_name: 0,
                            faction_name_lower: 0
                        }
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
            if (request.query.system && request.query.filterSystemInHistory === 'true') {
                lookupMatchAndArray.push(query.faction_presence.system_name_lower);
            } else if (request.query.systemId && request.query.filterSystemInHistory === 'true') {
                lookupMatchAndArray.push(query.faction_presence.system_id);
            }
            aggregate.lookup({
                from: "ebgshistoryfactionv5",
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
                            faction_id: 0,
                            faction_name: 0,
                            faction_name_lower: 0
                        }
                    }
                ]
            });
        }
    }

    let objectToMerge = {};

    if (request.query.systemDetails === 'true') {
        aggregate.lookup({
            from: "ebgssystemv5",
            as: "system_details",
            let: { "system_ids": "$system_ids" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$_id", "$$system_ids"]
                        }
                    }
                }
            ]
        });
        objectToMerge["system_details"] = {
            $arrayElemAt: [
                {
                    $filter: {
                        input: "$system_details",
                        as: "system",
                        cond: {
                            $eq: ["$$system._id", "$$system_info.system_id"]
                        }
                    }
                },
                0
            ]
        };
    }

    aggregate.addFields({
        faction_presence: {
            $map: {
                input: "$faction_presence",
                as: "system_info",
                in: {
                    $mergeObjects: [
                        "$$system_info",
                        objectToMerge
                    ]
                }
            }
        }
    });

    if (minimal) {
        aggregate.project({
            faction_presence: 0
        });
    }

    aggregate.project({
        system_ids: 0,
        system_details: 0
    });

    if (_.isEmpty(query)) {
        throw new Error("Add at least 1 query parameter to limit traffic");
    }

    aggregate.allowDiskUse(true);

    return factionModel.aggregatePaginate(aggregate, {
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
