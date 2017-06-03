"use strict";

module.exports = new Promise((resolve, reject) => {
    let db = require('../db');
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let faction = new Schema({
        id: {
            type: Number,
            unique: true
        },
        name: String,
        updated_at: Date,
        government_id: Number,
        government: String,
        allegiance_id: Number,
        allegiance: String,
        state_id: Number,
        state: String,
        home_system_id: Number,
        is_player_faction: Boolean
    });

    let model = mongoose.model('faction', faction);

    resolve(model);
})