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

const redisCache = require('../../../modules/utilities/rediscache');
const crypto = require('crypto');

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
router.get('/', cors(), async (req, res, next) => {
    // SHA 256 is a strong hash function that will produce unique hashes on even similar URLs
    let urlHash = crypto.createHash('sha256').update(req.originalUrl).digest("hex")

    // Check the in memory object cache for the URL
    const tickData = await redisCache.objCache.getKey(urlHash)
    if (tickData != null) {
        res.status(200).send(JSON.parse(tickData));
        return
    }

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

        // Store the result in redis
        redisCache.objCache.setKey(urlHash, JSON.stringify(result))

        res.status(200).json(result);
    } catch (err) {
        next(err);
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
