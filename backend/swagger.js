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

'use strict'

let swaggerJsDoc = require('swagger-jsdoc')

let swaggerDefinitions = require('./swaggerDefinitions')
const processVars = require('./processVars')

let makeSwaggerSpec = (params, security) => {
  let swaggerDefinition = {
    info: params.info,
    host: processVars.host,
    basePath: params.basePath,
    definitions: params.definitions,
    schemes: [ processVars.protocol ]
  }

  if (security) {
    swaggerDefinition.securityDefinitions = {
      http: {
        type: 'basic'
      }
    }
  }

  let options = {
    swaggerDefinition: swaggerDefinition,
    apis: params.apis
  }

  return swaggerJsDoc(options)
}

let paramsEBGSAPIv5 = {
  info: {
    title: 'Elite BGS API',
    version: '5.0.0',
    description: 'An API for Elite BGS'
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
}

let swaggerSpecEBGSAPIv5 = makeSwaggerSpec(paramsEBGSAPIv5, false)

module.exports.EBGSAPIv5 = swaggerSpecEBGSAPIv5
