"use strict";

const express = require('express');

let router = express.Router();

let eddb = require('../modules/eddb');

router.get('/body', (req, res) => {
    eddb.bodies.import()
        .then(() => {
            console.log("Bodies records updated from EDDB");
            res.json({
                updated: true,
                type: 'body'
            });
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/commodity', (req, res) => {
    eddb.commodities.import()
        .then(() => {
            console.log("Commodities records updated from EDDB");
            res.json({
                updated: true,
                type: 'commodity'
            });
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/faction', (req, res) => {
    eddb.factions.import()
        .then(() => {
            console.log("Factions records updated from EDDB");
            res.json({
                updated: true,
                type: 'faction'
            });
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/station', (req, res) => {
    eddb.stations.import()
        .then(() => {
            console.log("Stations records updated from EDDB");
            res.json({
                updated: true,
                type: 'station'
            });
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/populatedSystem', (req, res) => {
    eddb.populatedSystems.import()
        .then(() => {
            console.log("Populated systems records updated from EDDB");
            res.json({
                updated: true,
                type: 'populated system'
            });
        })
        .catch(err => {
            res.json(err);
        });
});

router.get('/system', (req, res) => {
    eddb.systems.import()
        .then(() => {
            console.log("Systems records updated from EDDB");
            res.json({
                updated: true,
                type: 'system'
            });
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;