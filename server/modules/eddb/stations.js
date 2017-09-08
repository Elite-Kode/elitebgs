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
const stationsModel = require('../../models/stations');
const utilities = require('../utilities');
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

let fileSize = require('../utilities/file_size');

module.exports = Stations;

const pathToFile = path.resolve(__dirname, '../../dumps/stations.json');

function Stations() {
    eventEmmiter.call(this);

    this.update = function () {
        let recordsUpdated = 0;
        new utilities.jsonParse(pathToFile)
            .on('start', () => {
                console.log(`EDDB station dump update reported`);
                this.emit('started', {
                    statusCode: 200,
                    update: "started",
                    type: 'station'
                });
            })
            .on('json', json => {
                json.import_commodities = objectify(json.import_commodities);
                json.export_commodities = objectify(json.export_commodities);
                json.prohibited_commodities = objectify(json.prohibited_commodities);
                json.economies = objectify(json.economies);
                json.selling_ships = objectify(json.selling_ships);
                stationsModel
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
                    console.log('Station Dump deleted');
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
                console.log(`EDDB station dump insertion reported`);
                this.emit('started', {
                    statusCode: 200,
                    insertion: "started",
                    type: 'station'
                });
            })
            .on('json', json => {
                json.import_commodities = objectify(json.import_commodities);
                json.export_commodities = objectify(json.export_commodities);
                json.prohibited_commodities = objectify(json.prohibited_commodities);
                json.economies = objectify(json.economies);
                json.selling_ships = objectify(json.selling_ships);
                stationsModel
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
                    console.log('Station Dump deleted');
                });
                this.emit('done', recordsInserted);
            })
            .on('error', err => {
                this.emit('error', err);
            })
    };

    this.download = function () {
        new utilities.download('https://eddb.io/archive/v5/stations.json', pathToFile)
            .on('start', response => {
                console.log(`EDDB station reported with status code ${response.statusCode}`);
                this.emit('started', {
                    response: response,
                    insertion: "started",
                    type: 'station'
                });
            })
            .on('end', () => {
                console.log(`EDDB station dump saved successfully with file size ${fileSize.withPath(pathToFile)}`)
                this.emit('done');
            })
            .on('error', err => {
                this.emit('error', err);
            })
    }

    this.downloadUpdate = function () {
        let recordsUpdated = 0;
        new utilities.downloadUpdate('https://eddb.io/archive/v5/stations.json', 'json')
            .on('start', response => {
                console.log(`EDDB station dump started with status code ${response.statusCode}`);
                this.emit('started', {
                    response: response,
                    insertion: "started",
                    type: 'station'
                });
            })
            .on('json', json => {
                json.import_commodities = objectify(json.import_commodities);
                json.export_commodities = objectify(json.export_commodities);
                json.prohibited_commodities = objectify(json.prohibited_commodities);
                json.economies = objectify(json.economies);
                json.selling_ships = objectify(json.selling_ships);
                stationsModel
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

    let objectify = ref => {
        let entities = ref;
        ref = [];
        entities.forEach((entity, index, allEntities) => {
            ref.push({
                name: entity,
                name_lower: entity.toLowerCase()
            });
        }, this);
        return ref;
    }
}

inherits(Stations, eventEmmiter);
