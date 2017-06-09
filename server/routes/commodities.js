"use strict";

const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
    require('../models/commodities')
        .then(commodities => {
            commodities.find({})
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

router.get('/id/:commodityid', (req, res) => {
    require('../models/commodities')
        .then(commodities => {
            let id = req.params.commodityid;
            commodities.find({ commodity_id: id })
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

module.exports = router;