"use strict";

module.exports = new Promise((resolve, reject) => {
    let db = require('../db');
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let system = new Schema({
        id: {
            type: Number,
            unique: true
        },
        edsm_id: Number,
        name: String,
        x: Number,
        y: Number,
        z: Number,
        population: Number,
        is_populated: Boolean,
        government_id: Number,
        government: String,
        allegiance_id: Number,
        allegiance: String,
        state_id: Number,
        state: String,
        security_id: Number,
        security: String,
        primary_economy_id: Number,
        primary_economy: String,
        power: String,
        power_state: String,
        power_state_id: Number,
        needs_permit: Boolean,
        updated_at: Date,
        simbad_ref: String,
        controlling_minor_faction_id: {
            type: Number,
            ref: 'faction.id'
        },
        controlling_minor_faction: {
            type: String,
            ref: 'faction.name'
        },
        reserve_type_id: Number,
        reserve_type: String
    });

    let model = mongoose.model('system', system);

    resolve(model);
})