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

module.exports = {
    _id: { type: "string" },
    __v: { type: "integer" },
    id: { type: "integer" },
    name: { type: "string" },
    name_lower: { type: "string" },
    system_id: { type: "integer" },
    updated_at: { type: "string" },
    max_landing_pad_size: { type: "string" },
    distance_to_star: { type: "integer" },
    government_id: { type: "integer" },
    government: { type: "string" },
    allegiance_id: { type: "integer" },
    allegiance: { type: "string" },
    state_id: { type: "integer" },
    state: { type: "string" },
    type_id: { type: "integer" },
    type: { type: "string" },
    has_blackmarket: { type: "boolean" },
    has_market: { type: "boolean" },
    has_refuel: { type: "boolean" },
    has_repair: { type: "boolean" },
    has_rearm: { type: "boolean" },
    has_outfitting: { type: "boolean" },
    has_shipyard: { type: "boolean" },
    has_docking: { type: "boolean" },
    has_commodities: { type: "boolean" },
    import_commodities: {
        type: 'array',
        items: {
            $ref: '#/definitions/StationItems'
        }
    },
    export_commodities: {
        type: 'array',
        items: {
            $ref: '#/definitions/StationItems'
        }
    },
    prohibited_commodities: {
        type: 'array',
        items: {
            $ref: '#/definitions/StationItems'
        }
    },
    economies: {
        type: 'array',
        items: {
            $ref: '#/definitions/StationItems'
        }
    },
    shipyard_updated_at: { type: "string" },
    outfitting_updated_at: { type: "string" },
    market_updated_at: { type: "string" },
    is_planetary: { type: "boolean" },
    selling_ships: {
        type: 'array',
        items: {
            $ref: '#/definitions/StationItems'
        }
    },
    selling_modules: {
        type: 'array',
        items: { type: "integer" }
    },
    settlement_size_id: { type: "integer" },
    settlement_size: { type: "string" },
    settlement_security_id: { type: "integer" },
    settlement_security: { type: "string" },
    body_id: { type: "integer" },
    controlling_minor_faction_id: { type: "integer" }
}
