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
var cors = require('cors')
const _ = require('lodash');

let router = express.Router();

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
   *       - name: timemin
   *         description: Minimum time for the faction history in miliseconds.
   *         in: query
   *         type: string
   *       - name: timemax
   *         description: Maximum time for the faction history in miliseconds.
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
   *             $ref: '#/definitions/EBGSFactionsPageV3'
   *     deprecated: true
   */
router.get('/', cors(), async (req, res, next) => {
    try {
        let factions = require('../../../models/ebgs_factions_v3');
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
            if (query._id) {
                query._id = mongoose.Types.ObjectId(query._id);
            }
            let aggregate = factions.aggregate();
            let aggregateOptions = {
                page: page,
                limit: 10
            }
            aggregate.match(query).project({
                _id: 1,
                eddb_id: 1,
                name: 1,
                name_lower: 1,
                updated_at: 1,
                government: 1,
                allegiance: 1,
                home_system_name: 1,
                is_player_faction: 1,
                faction_presence: 1,
                history: {
                    $filter: {
                        input: "$history",
                        as: "record",
                        cond: {
                            $and: [
                                { $lte: ["$$record.updated_at", lesserThanTime] },
                                { $gte: ["$$record.updated_at", greaterThanTime] }
                            ]
                        }
                    }
                }
            });
            factions.aggregatePaginate(
                aggregate,
                aggregateOptions,
                (err, resultDocs, page, items) => {
                    if (err) {
                        next(err);
                    } else {
                        let result = {
                            docs: resultDocs,
                            total: items,
                            limit: aggregateOptions.limit,
                            page: aggregateOptions.page,
                            pages: Math.ceil(items / aggregateOptions.limit)
                        }
                        res.status(200).json(result);
                    }
                }
            )
        } else {
            let paginateOptions = {
                select: { history: 0 },
                lean: true,
                leanWithId: false,
                page: page,
                limit: 10
            };
            let result = await factions.paginate(query, paginateOptions);
            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
