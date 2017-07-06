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
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

let fileSize = require('../utilities/file_size');
module.exports = Download;

function Download(pathFrom, pathTo) {
    eventEmmiter.call(this);
    let progressPercent = 0.0;
    progress(request.get(pathFrom, {headers: {'Accept-Encoding': 'gzip, deflate, sdch'}, gzip: true}))
        .on('response', response => {
            response.statusCode = 200;
            this.emit('start', response);
        })
        .on('progress', status => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`Downloading File of size ${fileSize.withValue(status.size.total)}\nTime Elapsed: ${status.time.elapsed}\t Time Remaining: ${status.time.remaining}\n${(status.percent * 100).toFixed(2)}% completed\t ${fileSize.withValue(status.size.transferred)} data transferred`);
            }
            progressPercent = status.percent * 100;
        })
        .on('error', err => {
            this.emit('error', {
                error: err,
                progress: progressPercent
            });
        })
        .pipe(fs.createWriteStream(pathTo)
            .on('finish', () => {
                this.emit('end');
            })
            .on('error', err => {
                this.emit('error', {
                    error: err,
                    progress: progressPercent
                });
            }));
}

inherits(Download, eventEmmiter);
