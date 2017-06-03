"use strict";

module.exports = new Promise((resolve, reject) => {
    let db = require('../db');
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let commodity = new Schema({
        id: {
            type: Number,
            unique: true
        },
        station_id: {
            type: Number,
            ref: 'station.id'
        },
        commodity_id: Number,
        supply: Number,
        buy_price: Number,
        sell_price: Number,
        demand: Number,
        collected_at: Date
    });

    let model = mongoose.model('commodity', commodity);

    resolve(model);
})