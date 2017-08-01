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

let swaggerJsDoc = require('swagger-jsdoc');

let host = '';

if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3001';
} else if (process.env.NODE_ENV === 'production') {
    host = 'elitebgs.kodeblox.com';
}

let swaggerDefinition = {
    info: {
        title: 'EDDB API',
        version: '1.0.0',
        description: 'An API for EDDB Data',
    },
    host: host,
    basePath: '/api/eddb/v1/',
    definitions: {
        Bodies: {
            properties: {
                username: { type: "string" },
                password: { type: "string" },
                path: { type: "string" }
            }
        }
    },
    securityDefinitions: {
        http: {
            type: "basic"
        }
    }
};

let options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./server/routes/eddb_api/v1/*.js']
};

let swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
