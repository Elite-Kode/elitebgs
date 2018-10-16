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

const request = require('request');
const progress = require('request-progress');
const fs = require('fs-extra');
const ndjson = require('ndjson');
const jsonStream = require('JSONStream');
const csvtojson = require('csvtojson/v1');
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

let fileSize = require('../utilities/file_size');
module.exports = DownloadUpdate;

function DownloadUpdate(pathFrom, type) {
    eventEmmiter.call(this);
    if (type === 'jsonl') {
        request.get(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true })
            .on('response', response => {
                response.statusCode = 200;
                this.emit('start', response);
            })
            .pipe(ndjson.parse())
            .on('data', json => {
                this.emit('json', json);
            })
            .on('end', () => {
                this.emit('end');
            })
            .on('error', error => {
                this.emit('error', error);
            })
    } else if (type === 'json') {
        request.get(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true })
            .on('response', response => {
                response.statusCode = 200;
                this.emit('start', response);
            })
            .pipe(jsonStream.parse('*'))
            .on('data', json => {
                this.emit('json', json);
            })
            .on('end', () => {
                this.emit('end');
            })
            .on('error', error => {
                this.emit('error', error);
            })
    } else if (type === 'csv') {
        csvtojson()
            .fromStream(request.get(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true })
                .on('response', response => {
                    response.statusCode = 200;
                    this.emit('start', response);
                }))
            .on('json', json => {
                this.emit('json', json);
            })
            .on('done', (error) => {
                if (error) {
                    this.emit('error', error);
                } else {
                    this.emit('end');
                }
            });
    }
}

inherits(DownloadUpdate, eventEmmiter);
