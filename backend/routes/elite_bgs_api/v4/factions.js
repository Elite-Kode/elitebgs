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
 *     deprecated: true
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
            query._id = req.query.id;
        }
        if (req.query.eddbId) {
            query.eddb_id = req.query.eddbId;
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

async function getFactions(query, history, page) {
    let paginateOptions = {
        select: { history: 0 },
        lean: true,
        leanWithId: false,
        page: page,
        limit: 10
    };
    if (_.isEmpty(query)) {
        throw new Error("Add at least 1 query parameter to limit traffic");
    }
    let factionModel = require('../../../models/ebgs_factions_v4');
    let factionResult = await factionModel.paginate(query, paginateOptions);
    if (!_.isEmpty(history)) {
        let historyModel = require('../../../models/ebgs_history_faction_v4');
        let historyPromises = [];
        factionResult.docs.forEach(faction => {
            historyPromises.push((async () => {
                let record = [];
                if (history.count) {
                    let systemPromises = [];
                    faction.faction_presence.forEach(system => {
                        systemPromises.push((() => {
                            return historyModel.find({
                                faction_id: faction._id,
                                system_lower: system.system_name_lower
                            }).sort({
                                updated_at: -1
                            }).limit(history.count).lean();
                        })());
                    });
                    let systems = await Promise.all(systemPromises);
                    systems.forEach(system => {
                        system.forEach(each => {
                            record.push(each);
                        });
                    });
                } else {
                    record = await historyModel.find({
                        faction_id: faction._id,
                        updated_at: {
                            $lte: history.lesser,
                            $gte: history.greater
                        }
                    }).lean();
                }
                record.forEach(history => {
                    delete history.faction_id;
                    delete history.faction_name;
                    delete history.faction_name_lower;
                });
                faction.history = record;
                return record;
            })());
        });
        await Promise.all(historyPromises);
    }
    return factionResult;
}

module.exports = router;
