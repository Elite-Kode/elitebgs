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
var cors = require('cors')
const _ = require('lodash');

let router = express.Router();

/**
 * @swagger
 * /ticks:
 *   get:
 *     description: Get the last tick time and tick history
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: timemin
 *         description: Minimum time for the tick history in miliseconds (Checks updated_at).
 *         in: query
 *         type: string
 *       - name: timemax
 *         description: Maximum time for the tick history in miliseconds (Checks updated_at).
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: An array of systems with historical data
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/TickTimesV4'
 *     deprecated: true
 */
router.get('/', cors(), async (req, res, next) => {
    try {
        let query = new Object;

        if (req.query.timemin && req.query.timemax) {
            query = {
                updated_at: {
                    $lte: new Date(Number(req.query.timemax)),
                    $gte: new Date(Number(req.query.timemin))
                }
            }
        }
        if (req.query.timemin && !req.query.timemax) {
            query = {
                updated_at: {
                    $lte: new Date(Number(+req.query.timemin + 604800000)),    // Adding seven days worth of miliseconds
                    $gte: new Date(Number(req.query.timemin))
                }
            }
        }
        if (!req.query.timemin && req.query.timemax) {
            query = {
                updated_at: {
                    $lte: new Date(Number(req.query.timemax)),
                    $gte: new Date(Number(+req.query.timemax - 604800000))    // Subtracting seven days worth of miliseconds
                }
            }
        }
        let result = await getTicks(query);
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
