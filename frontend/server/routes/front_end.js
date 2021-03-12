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
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const ebgsUsers = require('../models/ebgs_users');

let router = express.Router();

router.get('/backgroundimages', (req, res) => {
    let pathToFile = path.resolve(__dirname, '../../dist/assets/backgrounds');
    res.send(fs.readdirSync(pathToFile));
});

router.get('/donors', async (req, res, next) => {
    try {
        let users = await ebgsUsers;
        let donations = await users.aggregate().unwind('donation').project({
            amount: "$donation.amount",
            date: "$donation.date",
            username: 1
        }).sort({
            date: -1
        });
        res.send(donations);
    } catch (err) {
        next(err);
    }
});

router.get('/patrons', async (req, res, next) => {
    try {
        let users = await ebgsUsers;
        let patrons = await users.aggregate().match({
            "patronage.level": { $gt: 0 }
        }).project({
            level: "$patronage.level",
            since: "$patronage.since",
            username: 1
        }).sort({
            since: -1
        });
        res.send(patrons);
    } catch (err) {
        next(err);
    }
});

router.get('/credits', async (req, res, next) => {
    try {
        let users = await ebgsUsers;
        let credits = await users.aggregate().match({
            $or: [
                { os_contribution: { $gt: 0 } },
                { "patronage.level": { $gt: 1 } }
            ]
        }).project({
            username: 1,
            avatar: 1,
            id: 1,
            os_contribution: 1,
            level: "$patronage.level"
        }).sort({
            since: -1
        });
        res.send(credits);
    } catch (err) {
        next(err);
    }
});

router.get('/users', async (req, res, next) => {
    try {
        if (req.user.access === 0) {
            let users = await ebgsUsers;
            let query = new Object;
            let page = 1;
            if (req.query.id) {
                query._id = req.query.id;
            }
            if (req.query.beginsWith) {
                query["$or"] = [
                    {
                        username: {
                            $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`, 'i')
                        }
                    },
                    {
                        id: {
                            $regex: new RegExp(`^${_.escapeRegExp(req.query.beginsWith.toLowerCase())}`, 'i')
                        }
                    }
                ]
            }
            if (req.query.page) {
                page = req.query.page;
            }
            let paginateOptions = {
                lean: true,
                page: page,
                limit: 10,
                leanWithId: false
            };
            let result = await users.paginate(query, paginateOptions);
            res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
});

router.put('/users', async (req, res, next) => {
    try {
        if (req.user.access === 0 || req.user._id.toString() === req.body._id) {
            let users = await ebgsUsers;
            let body = req.body;
            body.$unset = {};
            for (const key in body) {
                if (body.hasOwnProperty(key)) {
                    const element = body[key];
                    if (element === null) {
                        delete body[key];
                        body.$unset[key] = 1;
                    }
                }
            }
            if (_.isEmpty(body.$unset)) {
                delete body.$unset
            }
            if (validateUser(body)) {
                await users.findOneAndUpdate(
                    {
                        _id: body._id
                    },
                    body,
                    {
                        upsert: false,
                        runValidators: true
                    })
                res.send(true);
            } else {
                res.send(false);
            }
        } else {
            res.send(false);
        }
    } catch (error) {
        next(error);
    }
});

router.get('/scripts', async (req, res, next) => {
    try {
        if (req.user.access === 0) {
            let pathToFile = path.resolve(__dirname, '../modules/scripts');
            let files = await fs.readdir(pathToFile);
            res.send(files);
        }
    } catch (err) {
        next(err);
    }
});

let validateUser = user => {
    if (_.has(user, '_id')
        && _.has(user, 'username')
        && _.has(user, 'discriminator')
        && _.has(user, 'access')
    ) {
        if (user.factions) {
            user.factions.forEach(faction => {
                if (!_.has(faction, 'name')
                    || !_.has(faction, 'name_lower')
                    || faction.name.toLowerCase() !== faction.name_lower
                ) {
                    return false;
                }
            });
        }
        if (user.systems) {
            user.systems.forEach(system => {
                if (!_.has(system, 'name')
                    || !_.has(system, 'name_lower')
                    || system.name.toLowerCase() !== system.name_lower
                ) {
                    return false;
                }
            });
        }
        return true;
    } else {
        return false;
    }
}

module.exports = router;
