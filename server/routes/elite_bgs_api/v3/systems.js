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

let router = express.Router();

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
   *       - name: security
   *         description: The name of the security status in the system.
   *         in: query
   *         type: string
   *       - name: beginswith
   *         description: Starting characters of the system.
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
   *         description: An array of systems with historical data
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/EBGSSystemsPageV3'
   */
router.get('/', (req, res, next) => {
    require('../../../models/ebgs_systems_v3')
        .then(systems => {
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
            if (req.query.state) {
                query.state = req.query.state.toLowerCase();
            }
            if (req.query.primaryeconomy) {
                query.primary_economy = req.query.primaryeconomy.toLowerCase();
            }
            if (req.query.security) {
                query.security = req.query.security.toLowerCase();
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
                let aggregate = systems.aggregate();
                let aggregateOptions = {
                    page: page,
                    limit: 10
                }
                aggregate.match(query).project({
                    _id: 1,
                    eddb_id: 1,
                    name: 1,
                    name_lower: 1,
                    x: 1,
                    y: 1,
                    z: 1,
                    population: 1,
                    government: 1,
                    allegiance: 1,
                    state: 1,
                    security: 1,
                    primary_economy: 1,
                    needs_permit: 1,
                    reserve_type: 1,
                    controlling_minor_faction: 1,
                    factions: 1,
                    updated_at: 1,
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
                systems.aggregatePaginate(
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
                    page: page,
                    limit: 10
                };
                systems.paginate(query, paginateOptions)
                    .then(result => {
                        res.status(200).json(result);
                    })
                    .catch(next)
            }
        })
        .catch(next);
});

router.post('/addhistory', (req, res, next) => {
    let sanitisedFactions = [];
    if (_.has(req.body, 'factions')) {
        req.body.factions.forEach(faction => {
            if (faction.name.toLowerCase() === faction.name_lower) {
                sanitisedFactions.push({
                    name: faction.name,
                    name_lower: faction.name_lower
                });
            }
        });
    }
    if (_.has(req.body, '_id')
        && _.has(req.body, 'allegiance')
        && _.has(req.body, 'controlling_minor_faction')
        && _.has(req.body, 'factions')
        && _.has(req.body, 'government')
        && _.has(req.body, 'population')
        && _.has(req.body, 'security')
        && _.has(req.body, 'state')
        && sanitisedFactions.length !== 0) {
        require('../../../models/ebgs_systems_v3')
            .then(system => {
                system.findOne(
                    { _id: req.body._id },
                    { history: 0 }
                ).lean()
                    .then(systemFound => {
                        sortFaction(systemFound.factions);
                        sortFaction(req.body.factions);
                        if (!_.isEqual(
                            _.pick(systemFound, [
                                'allegiance',
                                'controlling_minor_faction',
                                'factions',
                                'government',
                                'population',
                                'security',
                                'state'
                            ]),
                            _.pick(req.body, [
                                'allegiance',
                                'controlling_minor_faction',
                                'factions',
                                'government',
                                'population',
                                'security',
                                'state'
                            ])
                        )) {
                            let updateTime = new Date();
                            system.findOneAndUpdate(
                                { _id: req.body._id },
                                {
                                    updated_at: updateTime,
                                    allegiance: req.body.allegiance,
                                    controlling_minor_faction: req.body.controlling_minor_faction,
                                    factions: sanitisedFactions,
                                    government: req.body.government,
                                    population: req.body.population,
                                    security: req.body.security,
                                    state: req.body.state,
                                    $addToSet: {
                                        history: {
                                            updated_at: updateTime,
                                            updated_by: 'Test',
                                            allegiance: req.body.allegiance,
                                            controlling_minor_faction: req.body.controlling_minor_faction,
                                            factions: sanitisedFactions,
                                            government: req.body.government,
                                            population: req.body.population,
                                            security: req.body.security,
                                            state: req.body.state
                                        }
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
            });
    }
});

let sortFaction = faction => {
    faction.sort((a, b) => {
        if (a.name_lower < b.name_lower) {
            return -1;
        } else if (a.name_lower > b.name_lower) {
            return 1
        } else {
            return 0;
        }
    });
}

module.exports = router;
