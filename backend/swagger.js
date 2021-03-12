/*
 * KodeBlox Copyright 2021 Sayak Mukhopadhyay
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
const processVars = require('./processVars');

let makeSwaggerSpec = (params, security) => {
    let swaggerDefinition = {
        info: params.info,
        host: processVars.host,
        basePath: params.basePath,
        definitions: params.definitions,
        schemes: processVars.protocol
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
    apis: ['./routes/elite_bgs_api/v1/*.js']
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
    apis: ['./routes/elite_bgs_api/v2/*.js']
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
    apis: ['./routes/elite_bgs_api/v3/*.js']
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
        EBGSStationsPageV4: { properties: swaggerDefinitions.pagination('EBGSStationsV4') },
        TickTimesV4: { properties: swaggerDefinitions.tickTimesV4 },
        TickTimesHistoryV4: { properties: swaggerDefinitions.tickTimesHistoryV4 }
    },
    apis: ['./routes/elite_bgs_api/v4/*.js']
};

let swaggerSpecEBGSAPIv4 = makeSwaggerSpec(paramsEBGSAPIv4, false);

let paramsEBGSAPIv5 = {
    info: {
        title: 'Elite BGS API',
        version: '5.0.0',
        description: 'An API for Elite BGS',
    },
    basePath: '/api/ebgs/v5',
    definitions: {
        EBGSAllEconomiesV5: { properties: swaggerDefinitions.ebgsAllEconomiesV5 },
        EBGSConflictFactionV5: { properties: swaggerDefinitions.ebgsConflictFactionV5 },
        EBGSConflictSystemFactionV5: { properties: swaggerDefinitions.ebgsConflictSystemFactionV5 },
        EBGSConflictSystemV5: { properties: swaggerDefinitions.ebgsConflictSystemV5 },
        EBGSFactionHistorySystemV5: { properties: swaggerDefinitions.ebgsFactionHistorySystemV5 },
        EBGSFactionHistoryV5: { properties: swaggerDefinitions.ebgsFactionHistoryV5 },
        EBGSFactionPresenceV5: { properties: swaggerDefinitions.ebgsFactionPresenceV5 },
        EBGSFactionRefV5: { properties: swaggerDefinitions.ebgsFactionRefV5 },
        EBGSFactionsV5: { properties: swaggerDefinitions.ebgsFactionsV5 },
        EBGSNameAliasV5: { properties: swaggerDefinitions.ebgsNameAliasV5 },
        EBGSStateActiveV5: { properties: swaggerDefinitions.ebgsStateActiveV5 },
        EBGSStateV5: { properties: swaggerDefinitions.ebgsStateV5 },
        EBGSStationHistoryV5: { properties: swaggerDefinitions.ebgsStationHistoryV5 },
        EBGSStationServicesV5: { properties: swaggerDefinitions.ebgsStationServicesV5 },
        EBGSStationsV5: { properties: swaggerDefinitions.ebgsStationsV5 },
        EBGSSystemHistoryV5: { properties: swaggerDefinitions.ebgsSystemHistoryV5 },
        EBGSSystemRefV5: { properties: swaggerDefinitions.ebgsSystemRefV5 },
        EBGSSystemsV5: { properties: swaggerDefinitions.ebgsSystemsV5 },
        EBGSFactionsPageV5: { properties: swaggerDefinitions.pagination('EBGSFactionsV5') },
        EBGSSystemsPageV5: { properties: swaggerDefinitions.pagination('EBGSSystemsV5') },
        EBGSStationsPageV5: { properties: swaggerDefinitions.pagination('EBGSStationsV5') },
        TickTimesHistoryV5: { properties: swaggerDefinitions.tickTimesHistoryV5 },
        TickTimesV5: { properties: swaggerDefinitions.tickTimesV5 }
    },
    apis: ['./routes/elite_bgs_api/v5/*.js']
};

let swaggerSpecEBGSAPIv5 = makeSwaggerSpec(paramsEBGSAPIv5, false);

module.exports.EBGSAPIv1 = swaggerSpecEBGSAPIv1;
module.exports.EBGSAPIv2 = swaggerSpecEBGSAPIv2;
module.exports.EBGSAPIv3 = swaggerSpecEBGSAPIv3;
module.exports.EBGSAPIv4 = swaggerSpecEBGSAPIv4;
module.exports.EBGSAPIv5 = swaggerSpecEBGSAPIv5;
