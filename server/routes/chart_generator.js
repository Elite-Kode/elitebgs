/*
 * KodeBlox Copyright 2018 Sayak Mukhopadhyay
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

const express = require('express');
const _ = require('lodash');
const request = require('request-promise-native');

const processVars = require('../../processVars');
const FDevIDs = require('../fdevids')
const highchartsTheme = require('../modules/highcharts/highChartsTheme');

let router = express.Router();

router.get('/factions/influence', (req, res, next) => {
    let requestOptions = {
        url: `${processVars.protocol}://${processVars.host}/frontend/factions`,
        qs: {
            name: req.query.name,
            timemin: req.query.timemin,
            timemax: req.query.timemax
        },
        json: true
    };
    request.get(requestOptions)
        .then(response => {
            // Copied over from src\app\main\charts\faction-influence-chart.component.ts
            const history = response.docs[0].history;
            const allSystems = [];
            history.forEach(element => {
                if (allSystems.indexOf(element.system) === -1) {
                    allSystems.push(element.system);
                }
            });
            const series = [];
            history.sort((a, b) => {
                if (a.updated_at < b.updated_at) {
                    return -1;
                } else if (a.updated_at > b.updated_at) {
                    return 1;
                } else {
                    return 0;
                }
            });
            allSystems.forEach(system => {
                const data = [];
                history.forEach(element => {
                    if (element.system === system) {
                        data.push([
                            Date.parse(element.updated_at),
                            Number.parseFloat((element.influence * 100).toFixed(2))
                        ]);
                    } else {
                        if (element.systems.findIndex(systemElement => {
                            return systemElement.name === system;
                        }) === -1) {
                            data.push([Date.parse(element.updated_at), null]);
                        }
                    }
                });
                series.push({
                    name: system,
                    data: data
                });
            });
            let highchartsCurrentTheme = highchartsTheme.HighchartsLightTheme;
            if (req.query.theme === 'dark') {
                highchartsCurrentTheme = highchartsTheme.HighchartsDarkTheme;
            }
            let options = {
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: {
                        text: 'Influence'
                    }
                },
                title: { text: 'Influence Trend' },
                series: series,
                exporting: {
                    enabled: true,
                    sourceWidth: 1200
                }
            };
            let highchartsRequestOptions = {
                url: `https://export.highcharts.com/`,
                formData: {
                    options: JSON.stringify(options),
                    type: 'image/png',
                    filename: `${req.query.name}-${req.query.timemin}-${req.query.timemax}-infleunce`,
                    resources: JSON.stringify({
                        js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                    }),
                    scale: 2
                },
                encoding: null,
                resolveWithFullResponse: true
            }
            request.post(highchartsRequestOptions)
                .then(imageResponse => {
                    res.set('Content-Type', imageResponse.headers['content-type'])
                    res.set('Content-Disposition', imageResponse.headers['content-disposition'])
                    res.send(imageResponse.body);
                })
                .catch(next);
        })
        .catch(next);
});

router.get('/factions/state', (req, res, next) => {
    let requestOptions = {
        url: `${processVars.protocol}://${processVars.host}/frontend/factions`,
        qs: {
            name: req.query.name,
            timemin: req.query.timemin,
            timemax: req.query.timemax
        },
        json: true
    };
    request.get(requestOptions)
        .then(response => {
            // Copied over from src\app\main\charts\faction-state-chart.component.ts
            const history = response.docs[0].history;
            const allSystems = [];
            const systems = [];
            history.forEach(record => {
                if (allSystems.indexOf(record.system) === -1) {
                    allSystems.push(record.system);
                }
            });
            history.sort((a, b) => {
                if (a.updated_at < b.updated_at) {
                    return -1;
                } else if (a.updated_at > b.updated_at) {
                    return 1;
                } else {
                    return 0;
                }
            });
            const series = [];
            const states = Object.keys(FDevIDs.state).filter(state => {
                return state !== 'null';
            }).map(state => {
                return [state, FDevIDs.state[state].name];
            });
            let i = 0;
            states.forEach(state => {
                const data = [];
                allSystems.forEach((system, index) => {
                    systems.push(system);
                    let previousState = '';
                    let timeBegin = 0;
                    let timeEnd = 0;
                    history.forEach(record => {
                        if (record.system === system) {
                            if (previousState !== record.state) {
                                if (record.state === state[0]) {
                                    timeBegin = Date.parse(record.updated_at);
                                }
                                if (previousState === state[0] && record.state !== state[0]) {
                                    timeEnd = Date.parse(record.updated_at);
                                    data.push({
                                        x: timeBegin,
                                        x2: timeEnd,
                                        y: index
                                    });
                                }
                                previousState = record.state;
                            }
                        }
                    });
                    if (previousState === state[0]) {
                        data.push({
                            x: timeBegin,
                            x2: Date.now(),
                            y: index
                        });
                    }
                });
                series.push({
                    name: state[1],
                    pointWidth: 20,
                    data: data
                });
                i++;
            });
            let options = {
                chart: {
                    type: 'xrange'
                },
                title: {
                    text: 'State Periods'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: 'Systems'
                    },
                    categories: systems,
                    reversed: true
                },
                plotOptions: {
                    xrange: {
                        borderRadius: 0,
                        borderWidth: 0,
                        grouping: false,
                        dataLabels: {
                            align: 'center',
                            enabled: true,
                            format: '{point.name}'
                        },
                        colorByPoint: false
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 0.85em">{point.x} - {point.x2}</span><br/>',
                    pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
                },
                series: series,
                exporting: {
                    enabled: true,
                    sourceWidth: 1200
                }
            };
            let highchartsCurrentTheme = highchartsTheme.HighchartsLightTheme;
            if (req.query.theme === 'dark') {
                highchartsCurrentTheme = highchartsTheme.HighchartsDarkTheme;
            }
            let highchartsRequestOptions = {
                url: `https://export.highcharts.com/`,
                formData: {
                    options: JSON.stringify(options),
                    type: 'image/png',
                    filename: `${req.query.name}-${req.query.timemin}-${req.query.timemax}-state`,
                    resources: JSON.stringify({
                        js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                    }),
                    scale: 2
                },
                encoding: null,
                resolveWithFullResponse: true
            }
            request.post(highchartsRequestOptions)
                .then(imageResponse => {
                    res.set('Content-Type', imageResponse.headers['content-type'])
                    res.set('Content-Disposition', imageResponse.headers['content-disposition'])
                    res.send(imageResponse.body);
                })
                .catch(next);
        })
        .catch(next);
});

router.get('/systems/influence', (req, res, next) => {
    let requestOptions = {
        url: `${processVars.protocol}://${processVars.host}/frontend/systems`,
        qs: {
            name: req.query.name,
            timemin: req.query.timemin,
            timemax: req.query.timemax
        },
        json: true
    };
    request.get(requestOptions)
        .then(response => {
            // Copied over from src\app\main\charts\system-influence-chart.component.ts
            const factionHistory = response.docs[0].faction_history;
            const history = response.docs[0].history;
            const allTimeFactions = [];
            factionHistory.forEach(record => {
                if (allTimeFactions.indexOf(record.faction) === -1) {
                    allTimeFactions.push(record.faction);
                }
            });
            factionHistory.sort((a, b) => {
                if (a.updated_at < b.updated_at) {
                    return -1;
                } else if (a.updated_at > b.updated_at) {
                    return 1;
                } else {
                    return 0;
                }
            });
            const series = [];
            allTimeFactions.forEach(faction => {
                const data = [];
                factionHistory.forEach(record => {
                    if (record.faction === faction) {
                        data.push([
                            Date.parse(record.updated_at),
                            Number.parseFloat((record.influence * 100).toFixed(2))
                        ]);
                    } else {
                        const indexInSystem = history.findIndex(element => {
                            return element.updated_at === record.updated_at;
                        });
                        if (indexInSystem !== -1 && history[indexInSystem].factions.findIndex(element => {
                            return element.name_lower === faction;
                        }) === -1) {
                            data.push([Date.parse(record.updated_at), null]);
                        }
                    }
                });
                series.push({
                    name: faction,
                    data: data
                });
            });
            let options = {
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: {
                        text: 'Influence'
                    }
                },
                title: { text: 'Influence Trend' },
                series: series,
                exporting: {
                    enabled: true,
                    sourceWidth: 1200
                }
            };
            let highchartsCurrentTheme = highchartsTheme.HighchartsLightTheme;
            if (req.query.theme === 'dark') {
                highchartsCurrentTheme = highchartsTheme.HighchartsDarkTheme;
            }
            let highchartsRequestOptions = {
                url: `https://export.highcharts.com/`,
                formData: {
                    options: JSON.stringify(options),
                    type: 'image/png',
                    filename: `${req.query.name}-${req.query.timemin}-${req.query.timemax}-infleunce`,
                    resources: JSON.stringify({
                        js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                    }),
                    scale: 2
                },
                encoding: null,
                resolveWithFullResponse: true
            }
            request.post(highchartsRequestOptions)
                .then(imageResponse => {
                    res.set('Content-Type', imageResponse.headers['content-type'])
                    res.set('Content-Disposition', imageResponse.headers['content-disposition'])
                    res.send(imageResponse.body);
                })
                .catch(next);
        })
        .catch(next);
});

router.get('/systems/state', (req, res, next) => {
    let requestOptions = {
        url: `${processVars.protocol}://${processVars.host}/frontend/systems`,
        qs: {
            name: req.query.name,
            timemin: req.query.timemin,
            timemax: req.query.timemax
        },
        json: true
    };
    request.get(requestOptions)
        .then(response => {
            // Copied over from src\app\main\charts\system-state-chart.component.ts
            const factionHistory = response.docs[0].faction_history;
            const allTimeFactions = [];
            const factions = [];
            factionHistory.forEach(record => {
                if (allTimeFactions.indexOf(record.faction) === -1) {
                    allTimeFactions.push(record.faction);
                }
            });
            factionHistory.sort((a, b) => {
                if (a.updated_at < b.updated_at) {
                    return -1;
                } else if (a.updated_at > b.updated_at) {
                    return 1;
                } else {
                    return 0;
                }
            });
            const series = [];
            const states = Object.keys(FDevIDs.state).filter(state => {
                return state !== 'null';
            }).map(state => {
                return [state, FDevIDs.state[state].name];
            });
            let i = 0;
            states.forEach(state => {
                const data = [];
                allTimeFactions.forEach((faction, index) => {
                    factions.push(faction);
                    let previousState = '';
                    let timeBegin = 0;
                    let timeEnd = 0;
                    factionHistory.forEach(record => {
                        if (record.faction === faction) {
                            if (previousState !== record.state) {
                                if (record.state === state[0]) {
                                    timeBegin = Date.parse(record.updated_at);
                                }
                                if (previousState === state[0] && record.state !== state[0]) {
                                    timeEnd = Date.parse(record.updated_at);
                                    data.push({
                                        x: timeBegin,
                                        x2: timeEnd,
                                        y: index
                                    });
                                }
                                previousState = record.state;
                            }
                        }
                    });
                    if (previousState === state[0]) {
                        data.push({
                            x: timeBegin,
                            x2: Date.now(),
                            y: index
                        });
                    }
                });
                series.push({
                    name: state[1],
                    pointWidth: 20,
                    data: data
                });
                i++;
            });
            let options = {
                chart: {
                    type: 'xrange'
                },
                title: {
                    text: 'State Periods'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: 'Factions'
                    },
                    categories: factions,
                    reversed: true
                },
                plotOptions: {
                    xrange: {
                        borderRadius: 0,
                        borderWidth: 0,
                        grouping: false,
                        dataLabels: {
                            align: 'center',
                            enabled: true,
                            format: '{point.name}'
                        },
                        colorByPoint: false
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 0.85em">{point.x} - {point.x2}</span><br/>',
                    pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
                },
                series: series,
                exporting: {
                    enabled: true,
                    sourceWidth: 1200
                }
            };
            let highchartsCurrentTheme = highchartsTheme.HighchartsLightTheme;
            if (req.query.theme === 'dark') {
                highchartsCurrentTheme = highchartsTheme.HighchartsDarkTheme;
            }
            let highchartsRequestOptions = {
                url: `https://export.highcharts.com/`,
                formData: {
                    options: JSON.stringify(options),
                    type: 'image/png',
                    filename: `${req.query.name}-${req.query.timemin}-${req.query.timemax}-state`,
                    resources: JSON.stringify({
                        js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                    }),
                    scale: 2
                },
                encoding: null,
                resolveWithFullResponse: true
            }
            request.post(highchartsRequestOptions)
                .then(imageResponse => {
                    res.set('Content-Type', imageResponse.headers['content-type'])
                    res.set('Content-Disposition', imageResponse.headers['content-disposition'])
                    res.send(imageResponse.body);
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;
