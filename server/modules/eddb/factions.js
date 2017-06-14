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
const factionsModel = require('../../models/factions');

module.exports.import = () => {
    return new Promise((resolve, reject) => {
        factionsModel.then(model => {
            model.insertMany(require('../../dumps/factions.json'))
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    })
};

module.exports.download = () => {
    return new Promise((resolve, reject) => {
        require('../utilities').download('https://eddb.io/archive/v5/factions.json', path.resolve(__dirname, '../../dumps/factions.json'), 'faction')
            .then(msg => {
                resolve(msg);
            })
            .catch(err => {
                reject(err);
            });
    })
}