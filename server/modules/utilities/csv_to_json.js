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

const fs = require('fs-extra');
const csvtojson = require('csvtojson/v1');
const eventEmmiter = require('events').EventEmitter;
const inherits = require('util').inherits;

module.exports = CsvToJson;

function CsvToJson(path) {
    eventEmmiter.call(this);
    let firstData = true;
    csvtojson()
        .fromStream(fs.createReadStream(path))
        .on('json', json => {
            if (firstData) {
                firstData = !firstData;
                this.emit('start');
            }
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

inherits(CsvToJson, eventEmmiter);
