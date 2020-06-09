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
const mongoose = require('mongoose')
var cors = require('cors')
const _ = require('lodash');

let router = express.Router();
let ObjectId = mongoose.Types.ObjectId
let recordsPerPage = 10

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
 *       - name: beginswith
 *         description: Starting characters of the faction.
 *         in: query
 *         type: string
 *       - name: system
 *         description: Filter by system.
 *         in: query
 *         type: string
 *       - name: timemin
 *         description: Minimum time for the faction history in miliseconds.
 *         in: query
 *         type: string
 *       - name: timemax
 *         description: Maximum time for the faction history in miliseconds.
 *         in: query
 *         type: string
 *       - name: count
 *         description: Number of history records per system presence. Disables timemin and timemax
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
 *             $ref: '#/definitions/EBGSFactionsPageV4'
 */
router.get('/', cors(), async (req, res, next) => {
    try {
        let query = new Object;
        let page = 1;
        let history = false;
        let greaterThanTime;
        let lesserThanTime;
        let count;

        if (req.query.id) {
            query._id = arrayOrNot(req.query.id, ObjectId);
        }
        if (req.query.eddbId) {
            query.eddb_id = arrayOrNot(req.query.eddbId, parseInt);
        }
        if (req.query.name) {
            query.name_lower = arrayOrNot(req.query.name, _.toLower);
        }
        if (req.query.allegiance) {
            query.allegiance = arrayOrNot(req.query.allegiance, _.toLower);
        }
        if (req.query.government) {
            query.government = arrayOrNot(req.query.government, _.toLower);
        }
        if (req.query.beginsWith) {
            query.name_lower = {
                $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`)
            }
        }
        if (req.query.system) {

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
            let result = await getFactions(query, {
                greater: greaterThanTime,
                lesser: lesserThanTime,
                count: count
            }, page);
            res.status(200).json(result);
        } else {
            let result = await getFactions(query, {}, page);
            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});

function arrayOrNot(expressQueryParam, operation) {
    if (_.isArray(expressQueryParam)) {
        return {
            $in: _.map(expressQueryParam, _.curry(paramOperation)(operation))
        }
    } else {
        return operation(expressQueryParam);
    }
}

function paramOperation(operation, value) {
    return operation(value);
}

async function getFactions(query, history, page) {
    if (_.isEmpty(query)) {
        throw new Error("Add at least 1 query parameter to limit traffic");
    }
    let factionModel = await require('../../../models/ebgs_factions_v4');
    let aggregate = factionModel.aggregate()
    aggregate.match(query)
    if (!_.isEmpty(history)) {
        if (history.count) {
            aggregate.addFields({
                system_names_lower: {
                    $map: {
                        input: "$faction_presence",
                        as: "system_info",
                        in: "$$system_info.system_name_lower"
                    }
                }
            }).lookup({
                from: "ebgshistoryfactionv4",
                as: "history",
                let: { "id": "$_id", "system_name": "$system_names_lower" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$faction_id", "$$id"]
                                    },
                                    {
                                        $in: ["$system_lower", "$$system_name"]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            faction_id: 0,
                            faction_name: 0,
                            faction_name_lower: 0
                        }
                    },
                    {
                        $limit: history.count
                    }
                ]
            }).project({
                system_names_lower: 0
            });
        } else {
            aggregate.lookup({
                from: "ebgshistoryfactionv4",
                as: "history",
                let: { "id": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$faction_id", "$$id"]
                                    },
                                    {
                                        $gte: ["$updated_at", new Date(history.greater)]
                                    },
                                    {
                                        $lte: ["$updated_at", new Date(history.lesser)]
                                    }
                                ]
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

    return factionModel.aggregatePaginate(aggregate, {
        page,
        limit: recordsPerPage,
        customLabels: {
            totalDocs: "total",
            totalPages: "pages"
        }
    });
}

module.exports = router;
