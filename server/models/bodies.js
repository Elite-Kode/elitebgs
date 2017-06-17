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

module.exports = new Promise((resolve, reject) => {
    let db = require('../db');
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let body = new Schema({
        id: {
            type: Number,
            unique: true
        },
        created_at: Date,
        updated_at: Date,
        name: String,
        system_id: {
            type: Number,
            ref: 'system.id'
        },
        group_id: Number,
        group_name: String,
        type_id: Number,
        type_name: String,
        distance_to_arrival: Number,
        full_spectral_class: String,
        spectral_class: String,
        spectral_sub_class: String,
        luminosity_class: String,
        luminosity_sub_class: String,
        surface_temperature: Number,
        is_main_star: Boolean,
        age: Number,
        solar_masses: Number,
        solar_radius: Number,
        catalogue_gliese_id: String,
        catalogue_hipp_id: String,
        catalogue_hd_id: String,
        volcanism_type_id: Number,
        volcanism_type_name: String,
        atmosphere_type_id: Number,
        atmosphere_type_name: String,
        terraforming_state_id: Number,
        terraforming_state_name: String,
        earth_masses: Number,
        radius: Number,
        gravity: Number,
        surface_pressure: Number,
        orbital_period: Number,
        semi_major_axis: Number,
        orbital_eccentricity: Number,
        orbital_inclination: Number,
        arg_of_periapsis: Number,
        rotational_period: Number,
        is_rotational_period_tidally_locked: Boolean,
        axis_tilt: Number,
        eg_id: Number,
        belt_moon_masses: Number,
        ring_type_id: Number,
        ring_type_name: String,
        ring_mass: Number,
        ring_inner_radius: Number,
        ring_outer_radius: Number,
        rings: [{
            id: Number,
            created_at: Date,
            updated_at: Date,
            name: String,
            semi_major_axis: Number,
            ring_type_id: Number,
            ring_type_name: String,
            ring_mass: Number,
            ring_inner_radius: Number,
            ring_outer_radius: Number
        }],
        atmosphere_composition: [{
            atmosphere_component_id: Number,
            share: Number,
            atmosphere_component_name: String
        }],
        solid_composition: [{
            solid_component_id: Number,
            share: Number,
            solid_component_name: String
        }],
        materials: [{
            material_id: Number,
            share: Number,
            material_name: String
        }],
        is_landable: Boolean
    });

    body.pre('save', function (next) {
        this.created_at = this.created_at * 1000;
        this.updated_at = this.updated_at * 1000;
        if (this.rings) {
            this.rings.forEach((ring, index, rings) => {
                rings[index].created_at = ring.created_at * 1000;
                rings[index].updated_at = ring.updated_at * 1000;
            }, this);
        }
        next();
    });

    let model = mongoose.model('body', body);

    resolve(model);
})