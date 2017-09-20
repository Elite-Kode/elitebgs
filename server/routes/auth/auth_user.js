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

router.get('/', (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.send({});
    }
});

router.post('/edit', (req, res) => {
    if (req.user) {
        require('../../models/ebgs_users')
            .then(users => {
                let user = req.user;
                if (req.body.factions) {
                    arrayfy(req.body.factions).forEach(faction => {
                        if (user.factions.findIndex(element => {
                            return element.name.toLowerCase() === faction.toLowerCase();
                        }) === -1) {
                            user.factions.push({ name: faction });
                        }
                    });
                }
                if (req.body.systems) {
                    arrayfy(req.body.systems).forEach(system => {
                        if (user.systems.findIndex(element => {
                            return element.name.toLowerCase() === system.toLowerCase();
                        }) === -1) {
                            user.systems.push({ name: system });
                        }
                    });
                }
                users.findOneAndUpdate(
                    {
                        _id: req.user._id
                    },
                    user,
                    {
                        upsert: false,
                        runValidators: true
                    })
                    .then(user => {
                        res.send(true);
                    })
                    .catch(err => {
                        console.log(err);
                        res.send(false);
                    });
            })
            .catch(err => {
                console.log(err)
                res.send(false);
            });
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
