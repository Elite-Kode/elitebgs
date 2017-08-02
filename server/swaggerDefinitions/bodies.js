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
    created_at: { type: "string" },
    updated_at: { type: "string" },
    name: { type: "string" },
    name_lower: { type: "string" },
    system_id: { type: "integer" },
    group_id: { type: "integer" },
    group_name: { type: "string" },
    type_id: { type: "integer" },
    type_name: { type: "string" },
    distance_to_arrival: { type: "integer" },
    full_spectral_class: { type: "string" },
    spectral_class: { type: "string" },
    spectral_sub_class: { type: "string" },
    luminosity_class: { type: "string" },
    luminosity_sub_class: { type: "string" },
    surface_temperature: { type: "integer" },
    is_main_star: { type: "boolean" },
    age: { type: "integer" },
    solar_masses: { type: "integer" },
    solar_radius: { type: "integer" },
    catalogue_gliese_id: { type: "string" },
    catalogue_hipp_id: { type: "string" },
    catalogue_hd_id: { type: "string" },
    volcanism_type_id: { type: "integer" },
    volcanism_type_name: { type: "string" },
    atmosphere_type_id: { type: "integer" },
    atmosphere_type_name: { type: "string" },
    terraforming_state_id: { type: "integer" },
    terraforming_state_name: { type: "string" },
    earth_masses: { type: "integer" },
    radius: { type: "integer" },
    gravity: { type: "integer" },
    surface_pressure: { type: "integer" },
    orbital_period: { type: "integer" },
    semi_major_axis: { type: "integer" },
    orbital_eccentricity: { type: "integer" },
    orbital_inclination: { type: "integer" },
    arg_of_periapsis: { type: "integer" },
    rotational_period: { type: "integer" },
    is_rotational_period_tidally_locked: { type: "boolean" },
    axis_tilt: { type: "integer" },
    eg_id: { type: "integer" },
    belt_moon_masses: { type: "integer" },
    ring_type_id: { type: "integer" },
    ring_type_name: { type: "string" },
    ring_mass: { type: "integer" },
    ring_inner_radius: { type: "integer" },
    ring_outer_radius: { type: "integer" },
    rings: {
        type: 'array',
        items: {
            $ref: '#/definitions/Rings'
        }
    },
    atmosphere_composition: {
        type: 'array',
        items: {
            $ref: '#/definitions/AtmosphereComposition'
        }
    },
    solid_composition: {
        type: 'array',
        items: {
            $ref: '#/definitions/SolidComposition'
        }
    },
    materials: {
        type: 'array',
        items: {
            $ref: '#/definitions/Materials'
        }
    },
    is_landable: { type: "boolean" }
}
