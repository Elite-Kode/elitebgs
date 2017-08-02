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
    edsm_id: { type: "integer" },
    name: { type: "string" },
    name_lower: { type: "string" },
    x: { type: "integer" },
    y: { type: "integer" },
    z: { type: "integer" },
    population: { type: "integer" },
    is_populated: { type: "boolean" },
    government_id: { type: "integer" },
    government: { type: "string" },
    allegiance_id: { type: "integer" },
    allegiance: { type: "string" },
    state_id: { type: "integer" },
    state: { type: "string" },
    security_id: { type: "integer" },
    security: { type: "string" },
    primary_economy_id: { type: "integer" },
    primary_economy: { type: "string" },
    power: { type: "string" },
    power_state: { type: "string" },
    power_state_id: { type: "integer" },
    needs_permit: { type: "boolean" },
    updated_at: { type: "string" },
    simbad_ref: { type: "string" },
    controlling_minor_faction_id: { type: "integer" },
    controlling_minor_faction: { type: "string" },
    reserve_type_id: { type: "integer" },
    reserve_type: { type: "string" },
    minor_faction_presences: {
        type: 'array',
        items: {
            $ref: '#/definitions/PopulatedSystemPresence'
        }
    }
}
