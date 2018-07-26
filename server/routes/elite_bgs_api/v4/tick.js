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
var cors = require('cors')
const _ = require('lodash');

let router = express.Router();

/**
   * @swagger
   * /tick:
   *   get:
   *     description: Get a ballpark range of the tick time in UTC. Note... This value is an estimate and not official.
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: system
   *         description: Get the last recorded tick time for a system.
   *         in: query
   *         type: string
   *     responses:
   *       200:
   *         description: An array of systems with historical data
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Tick'
   */
router.get('/', cors(), (req, res, next) => {
    if (req.query.system) {
        require('../../../models/ebgs_systems_v4')
            .then(systemModel => {
                systemModel.findOne({
                    name_lower: req.query.system.toLowerCase()
                }).then(result => {
                    res.status(200).json({
                        system_tick: result.tick_time
                    });
                }).catch(next);
            }).catch(next);
    } else {
        require('../../../models/tick_times')
            .then(tickModel => {
                tickModel.findOne({}).then(result => {
                    res.status(200).json({
                        sol_start: result.sol_start,
                        sol_end: result.sol_end,
                        colonia_start: result.colonia_start,
                        colonia_end: result.colonia_end
                    });
                }).catch(next);
            }).catch(next);
    }
});

module.exports = router;
