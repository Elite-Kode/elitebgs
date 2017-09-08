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
const fs = require('fs-extra');
const populatedSystemsModel = require('../../models/populated_systems');
const utilities = require('../utilities');
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

let fileSize = require('../utilities/file_size');

module.exports = PopulatedSystems;

const pathToFile = path.resolve(__dirname, '../../dumps/systems_populated.json');

function PopulatedSystems() {
    eventEmmiter.call(this);

    this.update = function () {
        let recordsUpdated = 0;
        new utilities.jsonParse(pathToFile)
            .on('start', () => {
                console.log(`EDDB populated system dump update reported`);
                this.emit('started', {
                    statusCode: 200,
                    update: "started",
                    type: 'populated system'
                });
            })
            .on('json', json => {
                populatedSystemsModel
                    .then(model => {
                        model.findOneAndUpdate(
                            { id: json.id },
                            json,
                            {
                                upsert: true,
                                runValidators: true
                            })
                            .then(() => {
                                recordsUpdated++;
                            })
                            .catch((err) => {
                                this.emit('error', err);
                            });
                    })
                    .catch(err => {
                        this.emit('error', err);
                    });
            })
            .on('end', () => {
                console.log(`${recordsUpdated} records updated`);
                fs.unlink(pathToFile, () => {
                    console.log('Populated System Dump deleted');
                });
                this.emit('done', recordsUpdated);
            })
            .on('error', err => {
                this.emit('error', err);
            })
    };

    this.import = function () {
        let recordsInserted = 0;
        new utilities.jsonParse(pathToFile)
            .on('start', () => {
                console.log(`EDDB populated system dump insertion reported`);
                this.emit('started', {
                    statusCode: 200,
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
                                this.emit('error', err);
                            });
                    })
                    .catch(err => {
                        this.emit('error', err);
                    });
            })
            .on('end', () => {
                console.log(`${recordsInserted} records inserted`);
                fs.unlink(pathToFile, () => {
                    console.log('Populated System Dump deleted');
                });
                this.emit('done', recordsInserted);
            })
            .on('error', err => {
                this.emit('error', err);
            })
    };

    this.download = function () {
        new utilities.download('https://eddb.io/archive/v5/systems_populated.json', pathToFile)
            .on('start', response => {
                console.log(`EDDB populated system dump reported with status code ${response.statusCode}`);
                this.emit('started', {
                    response: response,
                    insertion: "started",
                    type: 'populated system'
                });
            })
            .on('end', () => {
                console.log(`EDDB populated system dump saved successfully with file size ${fileSize.withPath(pathToFile)}`)
                this.emit('done');
            })
            .on('error', err => {
                this.emit('error', err);
            })
    };

    this.downloadUpdate = function () {
        let recordsUpdated = 0;
        new utilities.downloadUpdate('https://eddb.io/archive/v5/systems_populated.json', 'json')
            .on('start', response => {
                console.log(`EDDB populated system dump started with status code ${response.statusCode}`);
                this.emit('started', {
                    response: response,
                    insertion: "started",
                    type: 'populated system'
                });
            })
            .on('json', json => {
                populatedSystemsModel
                    .then(model => {
                        model.findOneAndUpdate(
                            {
                                id: json.id,
                                updated_at: { $ne: json.updated_at }
                            },
                            json,
                            {
                                upsert: true,
                                runValidators: true
                            })
                            .then(() => {
                                recordsUpdated++;
                            })
                            .catch((err) => {
                                this.emit('error', err);
                            });
                    })
                    .catch(err => {
                        this.emit('error', err);
                    });
            })
            .on('end', () => {
                console.log(`${recordsUpdated} records updated`);
                this.emit('done', recordsUpdated);
            })
            .on('error', err => {
                this.emit('error', err);
            })
    }
}

inherits(PopulatedSystems, eventEmmiter);
