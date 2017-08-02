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

let swaggerDefinitions = require('./swaggerDefinitions');

let host = '';

if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3001';
} else if (process.env.NODE_ENV === 'production') {
    host = 'elitebgs.kodeblox.com';
}

let swaggerDefinitionEDDBAPIv1 = {
    info: {
        title: 'EDDB API',
        version: '1.0.0',
        description: 'An API for EDDB Data',
    },
    host: host,
    basePath: '/api/eddb/v1/',
    definitions: {
        AtmosphereComposition: { properties: swaggerDefinitions.atmosphereComposition },
        Bodies: { properties: swaggerDefinitions.bodies },
        Commodities: { properties: swaggerDefinitions.commodities },
        Factions: { properties: swaggerDefinitions.factions },
        Materials: { properties: swaggerDefinitions.materials },
        PopulatedSystemPresence: { properties: swaggerDefinitions.populatedSystemPresence },
        PopulatedSystems: { properties: swaggerDefinitions.populatedSystems },
        Rings: { properties: swaggerDefinitions.rings },
        SolidComposition: { properties: swaggerDefinitions.solidComposition },
        StationItems: { properties: swaggerDefinitions.stationItems },
        Stations: { properties: swaggerDefinitions.stations },
        Systems: { properties: swaggerDefinitions.systems }
    },
    securityDefinitions: {
        http: {
            type: "basic"
        }
    }
};

let optionsEDDBAPIv1 = {
    swaggerDefinition: swaggerDefinitionEDDBAPIv1,
    apis: ['./server/routes/eddb_api/v1/*.js']
};

let swaggerSpecEDDBAPIv1 = swaggerJsDoc(optionsEDDBAPIv1);

let swaggerDefinitionEBGSAPIv1 = {
    info: {
        title: 'Elite BGS API',
        version: '1.0.0',
        description: 'An API for Elite BGS',
    },
    host: host,
    basePath: '/api/ebgs/v1/',
    definitions: {
        EBGSFactionHistory: { properties: swaggerDefinitions.ebgsFactionHistory },
        EBGSFactionPresence: { properties: swaggerDefinitions.ebgsFactionPresence },
        EBGSFactions: { properties: swaggerDefinitions.ebgsFactions },
        EBGSState: { properties: swaggerDefinitions.ebgsState },
        EBGSSystemPresence: { properties: swaggerDefinitions.ebgsSystemPresence },
        EBGSSystems: { properties: swaggerDefinitions.ebgsSystems }
    },
    securityDefinitions: {
        http: {
            type: "basic"
        }
    }
};

let optionsEBGSAPIv1 = {
    swaggerDefinition: swaggerDefinitionEBGSAPIv1,
    apis: ['./server/routes/elite_bgs_api/v1/*.js']
};

let swaggerSpecEBGSAPIv1 = swaggerJsDoc(optionsEBGSAPIv1);

module.exports.EDDBAPIv1 = swaggerSpecEDDBAPIv1;
module.exports.EBGSAPIv1 = swaggerSpecEBGSAPIv1;
