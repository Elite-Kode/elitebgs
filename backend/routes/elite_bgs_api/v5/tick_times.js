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
const cors = require('cors')
const _ = require('lodash');
const redis = require('redis');
const crypto = require('crypto');

const redisPort = 6379
const redisClient = redis.createClient(redisPort);

//log error to the console if any occurs
redisClient.on("error", (err) => {
    console.log(err);
});

let router = express.Router();

/**
   * @swagger
   * /ticks:
   *   get:
   *     description: Get the last tick time and tick history
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: timeMin
   *         description: Minimum time for the tick history in milliseconds (Checks updated_at).
   *         in: query
   *         type: string
   *       - name: timeMax
   *         description: Maximum time for the tick history in milliseconds (Checks updated_at).
   *         in: query
   *         type: string
   *     responses:
   *       200:
   *         description: An array of systems with historical data
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/TickTimesV5'
   */

const redisGet = (key) => new Promise((resolve, reject) => {
    redisClient.get(key, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
    });
});

router.get('/', cors(), async (req, res, next) => {
    // A simple hash of the entire URL is used as a redis key. 
    // Even small changes in the URL result in different hashes
    let urlHash = require('crypto').createHash('sha256').update(req.originalUrl).digest("hex")

    // Check the cache for the hash, and if found, deserialize directly to the response and leave
    const ticks = await redisGet(urlHash)
    if (ticks != null) {
        res.status(200).send(JSON.parse(ticks));
    } else {
        try {
            let query = {};

            if (req.query.timeMin && req.query.timeMax) {
                query = {
                    updated_at: {
                        $lte: new Date(Number(req.query.timeMax)),
                        $gte: new Date(Number(req.query.timeMin))
                    }
                }
            }
            if (req.query.timeMin && !req.query.timeMax) {
                query = {
                    updated_at: {
                        $lte: new Date(Number(+req.query.timeMin + 604800000)),    // Adding seven days worth of miliseconds
                        $gte: new Date(Number(req.query.timeMin))
                    }
                }
            }
            if (!req.query.timeMin && req.query.timeMax) {
                query = {
                    updated_at: {
                        $lte: new Date(Number(req.query.timeMax)),
                        $gte: new Date(Number(+req.query.timeMax - 604800000))    // Subtracting seven days worth of miliseconds
                    }
                }
            }
            let result = await getTicks(query);
            // Store the tick result in redis for up one minute (everyone wants this to change)
            redisClient.setex(urlHash, 60, JSON.stringify(result));
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
});

async function getTicks(query) {
    let tickTimesV4Model = require('../../../models/tick_times_v4');
    let tickTimesResult = tickTimesV4Model.find(query).sort({ time: -1 }).lean();
    if (_.isEmpty(query)) {
        return tickTimesResult.limit(1);
    } else {
        return tickTimesResult;
    }
}

module.exports = router;
