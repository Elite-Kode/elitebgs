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
const request = require('request');
const fs = require('fs-extra');
const path = require('path');

let router = express.Router();

router.get('/body', (req, res) => {
    download('https://eddb.io/archive/v5/bodies.jsonl', '../dumps/bodies.jsonl', 'body')
        .then(msg => {
            res.json(msg);
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/commodity', (req, res) => {
    download('https://eddb.io/archive/v5/listings.csv', '../dumps/listings.csv', 'commodity')
        .then(msg => {
            res.json(msg);
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/faction', (req, res) => {
    download('https://eddb.io/archive/v5/factions.json', '../dumps/factions.json', 'faction')
        .then(msg => {
            res.json(msg);
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/station', (req, res) => {
    download('https://eddb.io/archive/v5/stations.json', '../dumps/stations.json', 'station')
        .then(msg => {
            res.json(msg);
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/populatedSystem', (req, res) => {
    download('https://eddb.io/archive/v5/systems_populated.json', '../dumps/systems_populated.json', 'populated system')
        .then(msg => {
            res.json(msg);
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/system', (req, res) => {
    download('https://eddb.io/archive/v5/systems.csv', '../dumps/systems.csv', 'system')
        .then(msg => {
            res.json(msg);
        })
        .catch(err => {
            res.json(err);
        });
});

function download(pathFrom, pathTo, type) {
    return new Promise((resolve, reject) => {
        request.get(pathFrom)
            .on('response', response => {
                console.log("EDDB " + type + " dump reported with status code " + response.statusCode);
            })
            .on('error', err => {
                reject(err);
            })
            .pipe(fs.createWriteStream(path.resolve(__dirname, pathTo))
                .on('finish', () => {
                    resolve({
                        downloaded: true,
                        type: type
                    });
                })
                .on('error', error => {
                    reject(error);
                }));
    })
}

module.exports = router;