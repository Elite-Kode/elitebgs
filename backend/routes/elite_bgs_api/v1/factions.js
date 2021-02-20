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
const passport = require('passport');
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
   *       - name: system
   *         description: The system name to fetch the history data for.
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
   *     responses:
   *       200:
   *         description: An array of factions with historical data
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/EBGSFactions'
   *     deprecated: true
   */
router.get('/', passport.authenticate('basic', { session: false }), async (req, res, next) => {
    try {
        let factions = require('../../../models/ebgs_factions');
        let query = new Object;

        if (req.query.name) {
            query.name_lower = req.query.name.toLowerCase();
        }
        if (req.query.allegiance) {
            query.allegiance = req.query.allegiance.toLowerCase();
        }
        if (req.query.government) {
            query.government = req.query.government.toLowerCase();
        }

        let factionSearch = async () => {
            if (_.isEmpty(query) && req.user.clearance !== 0) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            let result = await factions.find(query).limit(10).lean();
            let states = [];
            let systems = [];
            let timemin = null;
            let timemax = null;
            if (req.query.state) {
                states = arrayfy(req.query.state.toLowerCase());
            }
            if (req.query.system) {
                systems = arrayfy(req.query.system.toLowerCase());
            }
            if (req.query.timemin && req.query.timemax) {
                timemin = new Date(Number(req.query.timemin));
                timemax = new Date(Number(req.query.timemax));
            }

            if (states.length === 0 && systems.length === 0 && timemin === null && timemax === null) {
                result.forEach((doc, index, docs) => {
                    doc.history.sort((a, b) => {
                        var key1 = a.updated_at;
                        var key2 = b.updated_at;

                        if (key1 < key2) {
                            return 1;
                        } else if (key1 == key2) {
                            return 0;
                        } else {
                            return -1;
                        }
                    });
                    doc.history = [doc.history[0]];
                    docs[index] = doc;
                })
            } else if (states.length !== 0 || systems.length !== 0) {
                result.forEach((doc, index, docs) => {
                    let historySelected = []
                    doc.history.forEach(historyDoc => {
                        let historyBool = false;
                        if (states.length > 0) {
                            if (states.find(eachState => {
                                return historyDoc.state === eachState;
                            })) {
                                historyBool = true;
                            }
                        }

                        if (systems.length > 0) {
                            if (systems.find(eachSystem => {
                                return historyDoc.system_lower === eachSystem;
                            })) {
                                historyBool = true;
                            }
                        }
                        if (historyBool === true) {
                            historySelected.push(historyDoc);
                        }
                    });

                    if (timemax !== null && timemin !== null) {
                        let historySelectedTime = [];
                        historySelected.forEach(history => {
                            if (history.updated_at > timemin && history.updated_at < timemax) {
                                historySelectedTime.push(history);
                            }
                        })
                        historySelected = historySelectedTime;
                    } else {
                        historySelected.sort((a, b) => {
                            var key1 = a.updated_at;
                            var key2 = b.updated_at;

                            if (key1 < key2) {
                                return 1;
                            } else if (key1 == key2) {
                                return 0;
                            } else {
                                return -1;
                            }
                        });
                        if (historySelected.length > 0) {
                            historySelected = [historySelected[0]];
                        }
                    }
                    doc.history = historySelected;
                    docs[index] = doc;
                })
            } else if (timemin !== null && timemax !== null) {
                result.forEach((doc, index, docs) => {
                    let historySelected = [];
                    doc.history.forEach(history => {
                        if (history.updated_at > timemin && history.updated_at < timemax) {
                            historySelected.push(history);
                        }
                    });
                    doc.history = historySelected;
                    docs[index] = doc;
                })
            }
            res.status(200).json(result);
        }

        factionSearch();
    } catch (err) {
        next(err);
    }
});

let arrayfy = requestParam => {
    let regex = /\s*,\s*/;
    let mainArray = requestParam.split(regex);

    mainArray.forEach((element, index, allElements) => {
        allElements[index] = element.toLowerCase();
    }, this);

    return mainArray;
}

module.exports = router;
