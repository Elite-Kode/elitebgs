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
let schemes = '';

if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3001';
    schemes = 'http';
} else if (process.env.NODE_ENV === 'production') {
    host = 'elitebgs.kodeblox.com';
    schemes = 'https';
}

let makeSwaggerSpec = (params, security) => {
    let swaggerDefinition = {
        info: params.info,
        host: host,
        basePath: params.basePath,
        definitions: params.definitions,
        schemes: schemes
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
    basePath: '/api/eddb/v1',
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
    basePath: '/api/eddb/v2',
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
    basePath: '/api/eddb/v3',
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
    basePath: '/api/ebgs/v1',
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
    basePath: '/api/ebgs/v2',
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
    basePath: '/api/ebgs/v3',
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

let paramsEBGSAPIv4 = {
    info: {
        title: 'Elite BGS API',
        version: '4.0.0',
        description: 'An API for Elite BGS',
    },
    basePath: '/api/ebgs/v4',
    definitions: {
        EBGSFactionHistoryV4: { properties: swaggerDefinitions.ebgsFactionHistoryV4 },
        EBGSFactionPresenceV4: { properties: swaggerDefinitions.ebgsFactionPresenceV4 },
        EBGSFactionsV4: { properties: swaggerDefinitions.ebgsFactionsV4 },
        EBGSStateV4: { properties: swaggerDefinitions.ebgsStateV4 },
        EBGSSystemHistoryV4: { properties: swaggerDefinitions.ebgsSystemHistoryV4 },
        EBGSSystemPresenceV4: { properties: swaggerDefinitions.ebgsSystemPresenceV4 },
        EBGSSystemsV4: { properties: swaggerDefinitions.ebgsSystemsV4 },
        EBGSStationHistoryV4: { properties: swaggerDefinitions.ebgsStationHistoryV4 },
        EBGSStationServicesV4: { properties: swaggerDefinitions.ebgsStationServicesV4 },
        EBGSStationsV4: { properties: swaggerDefinitions.ebgsStationsV4 },
        EBGSFactionsPageV4: { properties: swaggerDefinitions.pagination('EBGSFactionsV4') },
        EBGSSystemsPageV4: { properties: swaggerDefinitions.pagination('EBGSSystemsV4') },
        EBGSStationsPageV4: { properties: swaggerDefinitions.pagination('EBGSStationsV4') }
    },
    apis: ['./server/routes/elite_bgs_api/v4/*.js']
};

let swaggerSpecEBGSAPIv4 = makeSwaggerSpec(paramsEBGSAPIv4, false);

module.exports.EDDBAPIv1 = swaggerSpecEDDBAPIv1;
module.exports.EDDBAPIv2 = swaggerSpecEDDBAPIv2;
module.exports.EDDBAPIv3 = swaggerSpecEDDBAPIv3;
module.exports.EBGSAPIv1 = swaggerSpecEBGSAPIv1;
module.exports.EBGSAPIv2 = swaggerSpecEBGSAPIv2;
module.exports.EBGSAPIv3 = swaggerSpecEBGSAPIv3;
module.exports.EBGSAPIv4 = swaggerSpecEBGSAPIv4;
