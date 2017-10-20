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
    host = 'localhost:4001';
}

let makeSwaggerSpec = (params, security) => {
    let swaggerDefinition = {
        info: params.info,
        host: host,
        basePath: params.basePath,
        definitions: params.definitions
    };

    if (security) {
        swaggerDefinition.securityDefinitions = {
            http: {
                type: "basic"
            }
        };
    }

    let options = {
        swaggerDefinition: swaggerDefinition,
        apis: params.apis
    };

    return swaggerJsDoc(options);
}

let paramsEDDBAPIv1 = {
    info: {
        title: 'EDDB API',
        version: '1.0.0',
        description: 'An API for EDDB Data',
    },
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
    apis: ['./server/routes/eddb_api/v1/*.js']
};

let swaggerSpecEDDBAPIv1 = makeSwaggerSpec(paramsEDDBAPIv1, true);

let paramsEDDBAPIv2 = {
    info: {
        title: 'EDDB API',
        version: '2.0.0',
        description: 'An API for EDDB Data',
    },
    basePath: '/api/eddb/v2/',
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
        Systems: { properties: swaggerDefinitions.systems },
        BodiesPage: { properties: swaggerDefinitions.pagination('Bodies') },
        FactionsPage: { properties: swaggerDefinitions.pagination('Factions') },
        PopulatedSystemsPage: { properties: swaggerDefinitions.pagination('PopulatedSystems') },
        StationsPage: { properties: swaggerDefinitions.pagination('Stations') },
        SystemsPage: { properties: swaggerDefinitions.pagination('Systems') }
    },
    apis: ['./server/routes/eddb_api/v2/*.js']
};

let swaggerSpecEDDBAPIv2 = makeSwaggerSpec(paramsEDDBAPIv2, true);

let paramsEDDBAPIv3 = {
    info: {
        title: 'EDDB API',
        version: '3.0.0',
        description: 'An API for EDDB Data',
    },
    basePath: '/api/eddb/v3/',
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
        Systems: { properties: swaggerDefinitions.systems },
        BodiesPage: { properties: swaggerDefinitions.pagination('Bodies') },
        FactionsPage: { properties: swaggerDefinitions.pagination('Factions') },
        PopulatedSystemsPage: { properties: swaggerDefinitions.pagination('PopulatedSystems') },
        StationsPage: { properties: swaggerDefinitions.pagination('Stations') },
        SystemsPage: { properties: swaggerDefinitions.pagination('Systems') }
    },
    apis: ['./server/routes/eddb_api/v3/*.js']
};

let swaggerSpecEDDBAPIv3 = makeSwaggerSpec(paramsEDDBAPIv3, false);

let paramsEBGSAPIv1 = {
    info: {
        title: 'Elite BGS API',
        version: '1.0.0',
        description: 'An API for Elite BGS',
    },
    basePath: '/api/ebgs/v1/',
    definitions: {
        EBGSFactionHistory: { properties: swaggerDefinitions.ebgsFactionHistory },
        EBGSFactionPresence: { properties: swaggerDefinitions.ebgsFactionPresence },
        EBGSFactions: { properties: swaggerDefinitions.ebgsFactions },
        EBGSState: { properties: swaggerDefinitions.ebgsState },
        EBGSSystemPresence: { properties: swaggerDefinitions.ebgsSystemPresence },
        EBGSSystems: { properties: swaggerDefinitions.ebgsSystems }
    },
    apis: ['./server/routes/elite_bgs_api/v1/*.js']
};

let swaggerSpecEBGSAPIv1 = makeSwaggerSpec(paramsEBGSAPIv1, true);

let paramsEBGSAPIv2 = {
    info: {
        title: 'Elite BGS API',
        version: '2.0.0',
        description: 'An API for Elite BGS',
    },
    basePath: '/api/ebgs/v2/',
    definitions: {
        EBGSFactionHistory: { properties: swaggerDefinitions.ebgsFactionHistory },
        EBGSFactionPresence: { properties: swaggerDefinitions.ebgsFactionPresence },
        EBGSFactions: { properties: swaggerDefinitions.ebgsFactions },
        EBGSState: { properties: swaggerDefinitions.ebgsState },
        EBGSSystemPresence: { properties: swaggerDefinitions.ebgsSystemPresence },
        EBGSSystems: { properties: swaggerDefinitions.ebgsSystems },
        EBGSFactionsPage: { properties: swaggerDefinitions.pagination('EBGSFactions') },
        EBGSSystemsPage: { properties: swaggerDefinitions.pagination('EBGSSystems') }
    },
    apis: ['./server/routes/elite_bgs_api/v2/*.js']
};

let swaggerSpecEBGSAPIv2 = makeSwaggerSpec(paramsEBGSAPIv2, true);

let paramsEBGSAPIv3 = {
    info: {
        title: 'Elite BGS API',
        version: '3.0.0',
        description: 'An API for Elite BGS',
    },
    basePath: '/api/ebgs/v3/',
    definitions: {
        EBGSFactionHistoryV3: { properties: swaggerDefinitions.ebgsFactionHistoryV3 },
        EBGSFactionPresenceV3: { properties: swaggerDefinitions.ebgsFactionPresenceV3 },
        EBGSFactionsV3: { properties: swaggerDefinitions.ebgsFactionsV3 },
        EBGSStateV3: { properties: swaggerDefinitions.ebgsStateV3 },
        EBGSSystemHistoryV3: { properties: swaggerDefinitions.ebgsSystemHistoryV3 },
        EBGSSystemPresenceV3: { properties: swaggerDefinitions.ebgsSystemPresenceV3 },
        EBGSSystemsV3: { properties: swaggerDefinitions.ebgsSystemsV3 },
        EBGSFactionsPageV3: { properties: swaggerDefinitions.pagination('EBGSFactionsV3') },
        EBGSSystemsPageV3: { properties: swaggerDefinitions.pagination('EBGSSystemsV3') }
    },
    apis: ['./server/routes/elite_bgs_api/v3/*.js']
};

let swaggerSpecEBGSAPIv3 = makeSwaggerSpec(paramsEBGSAPIv3, false);

module.exports.EDDBAPIv1 = swaggerSpecEDDBAPIv1;
module.exports.EDDBAPIv2 = swaggerSpecEDDBAPIv2;
module.exports.EDDBAPIv3 = swaggerSpecEDDBAPIv3;
module.exports.EBGSAPIv1 = swaggerSpecEBGSAPIv1;
module.exports.EBGSAPIv2 = swaggerSpecEBGSAPIv2;
module.exports.EBGSAPIv3 = swaggerSpecEBGSAPIv3;
