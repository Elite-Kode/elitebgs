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
   */
router.get('/', (req, res, next) => {
    require('../../../models/ebgs_factions_v3')
        .then(factions => {
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
                    $regex: new RegExp(`^${req.query.beginsWith.toLowerCase()}`)
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
                    query._id = require('../../../db').mongoose.Types.ObjectId(query._id);
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
                factions.paginate(query, paginateOptions)
                    .then(result => {
                        res.status(200).json(result);
                    })
                    .catch(next)
            }
        })
        .catch(next);
});

router.post('/addhistory', (req, res, next) => {
    require('../../../models/ebgs_factions_v3')
        .then(faction => {
            faction.findOne(
                { _id: req.body._id },
                { history: 0 }
            ).lean()
                .then(factionFound => {
                    sortPresence(factionFound.faction_presence);
                    sortPresence(req.body.faction_presence);
                    if (!_.isEqual(factionFound.faction_presence, req.body.faction_presence)) {
                        let history = [];
                        let updateTime = new Date();
                        let allSystems = [];
                        req.body.faction_presence.forEach(system => {
                            allSystems.push({
                                name: system.system_name,
                                name_lower: system.system_name_lower
                            });
                        });
                        req.body.faction_presence.forEach(system => {
                            let index = factionFound.faction_presence.findIndex(element => {
                                return element.system_name === system.system_name;
                            });
                            if (index !== -1 && !_.isEqual(system, factionFound.faction_presence[index])) {
                                history.push({
                                    updated_at: updateTime,
                                    updated_by: 'Test',
                                    system: system.system_name,
                                    system_lower: system.system_name_lower,
                                    state: system.state,
                                    influence: system.influence,
                                    pending_states: system.pending_states,
                                    recovering_states: system.recovering_states,
                                    systems: allSystems
                                });
                            }
                        });
                        faction.findOneAndUpdate(
                            { _id: req.body._id },
                            {
                                updated_at: updateTime,
                                faction_presence: req.body.faction_presence,
                                $addToSet: {
                                    history: { $each: history }
                                }
                            },
                            {
                                upsert: true,
                                runValidators: true
                            })
                            .then(faction => {
                                res.send(true);
                            })
                            .catch(next);
                    }
                })
                .catch(next);
        })
        .catch(next);
});

let sortPresence = presence => {
    presence.forEach(system => {
        system.pending_states.sort((a, b) => {
            if (a.state < b.state) {
                return -1;
            } else if (a.state > b.state) {
                return 1
            } else {
                return 0;
            }
        });
        system.recovering_states.sort((a, b) => {
            if (a.state < b.state) {
                return -1;
            } else if (a.state > b.state) {
                return 1
            } else {
                return 0;
            }
        });
    });
    presence.sort((a, b) => {
        if (a.system_name_lower < b.system_name_lower) {
            return -1;
        } else if (a.system_name_lower > b.system_name_lower) {
            return 1
        } else {
            return 0;
        }
    });
}

module.exports = router;
