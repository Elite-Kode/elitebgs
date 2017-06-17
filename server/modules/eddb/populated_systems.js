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

const path = require('path');
const populatedSystemsModel = require('../../models/populated_systems');
const utilities = require('../utilities');

module.exports.update = () => {
    let recordsUpdated = 0;
    return new Promise((resolve, reject) => {
        new utilities.jsonParse(path.resolve(__dirname, '../../dumps/systems_populated.json'))
            .on('start', () => {
                console.log(`EDDB populated system dump update reported`);
                resolve({
                    update: "started",
                    type: 'populated system'
                });
            })
            .on('json', json => {
                bodiesModel
                    .then(model => {
                        let document = new model(json);
                        document.findOneAndUpdate(
                            { id: document.id },
                            document,
                            {
                                upsert: true,
                                runValidators: true
                            })
                            .then(() => {
                                recordsUpdated++;
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .on('end', () => {
                console.log(`${recordsUpdated} records updated`);
            })
            .on('error', err => {
                reject(err);
            })
    })
};

module.exports.import = () => {
    let recordsInserted = 0;
    return new Promise((resolve, reject) => {
        new utilities.jsonParse(path.resolve(__dirname, '../../dumps/systems_populated.json'))
            .on('start', () => {
                console.log(`EDDB populated system dump insertion reported`);
                resolve({
                    insertion: "started",
                    type: 'populated system'
                });
            })
            .on('json', json => {
                populatedSystemsModel
                    .then(model => {
                        let document = new model(json);
                        document.save()
                            .then(() => {
                                recordsInserted++;
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .on('end', () => {
                console.log(`${recordsInserted} records inserted`);
            })
            .on('error', err => {
                reject(err);
            })
    })
};

module.exports.download = () => {
    return new Promise((resolve, reject) => {
        utilities.download('https://eddb.io/archive/v5/systems_populated.json', path.resolve(__dirname, '../../dumps/systems_populated.json'), 'populated system')
            .then(msg => {
                resolve(msg);
            })
            .catch(err => {
                reject(err);
            });
    })
}