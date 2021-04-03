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
 * /stations:
 *   get:
 *     description: Get the Stations
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID of the document.
 *         in: query
 *         type: string
 *       - name: eddbId
 *         description: EDDB ID of the station.
 *         in: query
 *         type: string
 *       - name: name
 *         description: Station name.
 *         in: query
 *         type: string
 *       - name: type
 *         description: Station type.
 *         in: query
 *         type: string
 *       - name: system
 *         description: System name the station is in.
 *         in: query
 *         type: string
 *       - name: systemId
 *         description: Filter by system id.
 *         in: query
 *         type: string
 *       - name: economy
 *         description: Station economy.
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
 *         description: State the station is in.
 *         in: query
 *         type: string
 *       - name: beginsWith
 *         description: Starting characters of the station.
 *         in: query
 *         type: string
 *       - name: timeMin
 *         description: Minimum time for the station history in milliseconds.
 *         in: query
 *         type: string
 *       - name: timeMax
 *         description: Maximum time for the station history in milliseconds.
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
 *         description: An array of stations with historical data
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/EBGSStationsPageV5'
 */
router.get('/', cors(), async (req, res, next) => {
    // SHA 256 is a strong hash function that will produce unique hashes on even similar URLs
    let urlHash = crypto.createHash('sha256').update(req.originalUrl).digest("hex")

    // Check the in memory object cache for the URL
    const stationData = await redisCache.objCache.getKey(urlHash)
    if (stationData != null) {
        res.status(200).send(JSON.parse(stationData));
        return
    }

    try {
        let query = {};
        let page = 1;
        let history = false;
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
        if (req.query.type) {
            query.type = utilities.arrayOrNot(req.query.type, _.toLower);
        }
        if (req.query.system) {
            query.system_lower = utilities.arrayOrNot(req.query.system, _.toLower);
        }
        if (req.query.systemId) {
            query.system_id = utilities.arrayOrNot(req.query.systemId, ObjectId);
        }
        if (req.query.economy) {
            query.economy = utilities.arrayOrNot(req.query.economy, _.toLower);
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
        if (req.query.beginsWith || (req.query.beginsWith === "" && req.query.page)) {
            query.name_lower = {
                $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`)
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
            let result = await getStations(query, {
                greater: greaterThanTime,
                lesser: lesserThanTime,
                count: count
            }, page);

            // Store the result in redis
            redisCache.objCache.setKey(urlHash, JSON.stringify(result))

            res.status(200).json(result);
        } else {
            let result = await getStations(query, {}, page);

            // Store the result in redis
            redisCache.objCache.setKey(urlHash, JSON.stringify(result))

            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});

async function getStations(query, history, page) {
    let stationModel = require('../../../models/ebgs_stations_v5');
    let aggregate = stationModel.aggregate().option(aggregateOptions);
    aggregate.match(query);

    let countAggregate = stationModel.aggregate().option(aggregateOptions);
    countAggregate.match(query);

    if (!_.isEmpty(history)) {
        let lookupMatchAndArray = [{
            $eq: ["$station_id", "$$id"]
        }];
        if (history.count) {
            aggregate.lookup({
                from: "ebgshistorystationv5",
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
                            station_id: 0,
                            station_name: 0,
                            station_name_lower: 0
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
                from: "ebgshistorystationv5",
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
                            station_id: 0,
                            station_name: 0,
                            station_name_lower: 0
                        }
                    }
                ]
            });
        }
    }

    if (_.isEmpty(query)) {
        throw new Error("Add at least 1 query parameter to limit traffic");
    }

    aggregate.allowDiskUse(true);

    return stationModel.aggregatePaginate(aggregate, {
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
