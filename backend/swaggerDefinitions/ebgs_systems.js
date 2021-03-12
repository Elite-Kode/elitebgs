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

module.exports = {
    _id: { type: "string" },
    __v: { type: "integer" },
    eddb_id: { type: "integer" },
    edsm_id: { type: "integer" },
    name: { type: "string" },
    name_lower: { type: "string" },
    x: { type: "integer" },
    y: { type: "integer" },
    z: { type: "integer" },
    population: { type: "integer" },
    government: { type: "string" },
    allegiance: { type: "string" },
    state: { type: "string" },
    security: { type: "string" },
    primary_economy: { type: "string" },
    power: {
        type: 'array',
        items: { type: "string" }
    },
    power_state: { type: "string" },
    needs_permit: { type: "boolean" },
    updated_at: { type: "string" },
    simbad_ref: { type: "string" },
    controlling_minor_faction: { type: "string" },
    reserve_type: { type: "string" },
    minor_faction_presences: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSSystemPresence'
        }
    }
}
