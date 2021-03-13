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

const express = require('express');
const _ = require('lodash');
const un_eval = require('un-eval');
const request = require('request-promise-native');
const moment = require('moment');

const processVars = require('../processVars');
const FDevIDs = require('../fdevids')
const highchartsTheme = require('../modules/highcharts/highChartsTheme');

let router = express.Router();

router.get('/factions/influence', async (req, res, next) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/factions`,
            qs: {
                name: req.query.name,
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax,
                systemDetails: 'true'
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\faction-influence-chart.component.ts
        const history = responseObject.docs[0].history;
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
            let lastElement;
            history.forEach(element => {
                if (element.system === system) {
                    data.push([
                        Date.parse(element.updated_at),
                        Number.parseFloat((element.influence * 100).toFixed(2))
                    ]);
                    lastElement = element;
                } else {
                    if (element.systems.findIndex(systemElement => {
                        return systemElement.name === system;
                    }) === -1) {
                        data.push([Date.parse(element.updated_at), null]);
                    }
                }
            });
            const latestUpdate = responseObject.docs[0].faction_presence.find(findSystem => {
                return findSystem.system_name === system;
            });
            if (latestUpdate) {
                data.push([
                    Date.parse(latestUpdate.updated_at),
                    Number.parseFloat((lastElement.influence * 100).toFixed(2))
                ]);
            }
            series.push({
                name: system,
                data: data
            });
        });
        let options = {
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Influence'
                }
            },
            title: {
                text: 'Influence Trend'
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
            url: `http://localhost:7801/`,
            formData: {
                options: JSON.stringify(options),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-infleunce`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
});

router.get('/factions/state', async (req, res, next) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/factions`,
            qs: {
                name: req.query.name,
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax,
                systemDetails: 'true'
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\faction-state-chart.component.ts
        const history = responseObject.docs[0].history;
        const allSystems = [];
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
                height: 130 + allSystems.length * 40,
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
                categories: allSystems,
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
            url: `http://localhost:7801/`,
            formData: {
                options: JSON.stringify(options),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-state`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
});

router.get('/factions/active', (req, res, next) => {
    factionActivePendingRecovering(req, res, next, 'active');
});

router.get('/factions/pending', (req, res, next) => {
    factionActivePendingRecovering(req, res, next, 'pending');
});

router.get('/factions/recovering', (req, res, next) => {
    factionActivePendingRecovering(req, res, next, 'recovering');
});

let factionActivePendingRecovering = async (req, res, next, type) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/factions`,
            qs: {
                name: req.query.name,
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax,
                systemDetails: 'true'
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\faction-a-p-r-state-chart.component.ts
        let stateType;
        let stateTitle;
        switch (type) {
            case 'active':
                stateType = 'active_states';
                stateTitle = 'Active State';
                break;
            case 'pending':
                stateType = 'pending_states';
                stateTitle = 'Pending State';
                break;
            case 'recovering':
                stateType = 'recovering_states';
                stateTitle = 'Recovering State';
                break;
            default:
                stateType = 'pending_states';
                stateTitle = 'Pending State';
        }
        const allTimeSystems = [];
        const allTimeStates = [];
        const maxStatesConcurrent = [];
        const systems = [];
        const history = responseObject.docs[0].history;
        history.forEach(record => {
            if (allTimeSystems.indexOf(record.system) === -1) {
                allTimeSystems.push(record.system);
            }
        });
        allTimeSystems.forEach((system, index) => {
            const allStates = [];
            let maxStates = 0;
            history.forEach((record, recordIndex, records) => {
                if (record.system === system && record[stateType]) {
                    if (record[stateType].length === 0) {
                        records[recordIndex][stateType].push({
                            state: 'none',
                            trend: 0
                        });
                    }
                    record[stateType].forEach(recordState => {
                        if (allStates.indexOf(recordState.state) === -1) {
                            allStates.push(recordState.state);
                        }
                    });
                    maxStates = record[stateType].length > maxStates ? record[stateType].length : maxStates;
                }
            });
            allTimeStates.push(allStates);
            if (maxStates === 0) {
                maxStates = 1;
            }
            maxStatesConcurrent.push(maxStates);
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
        // const series: XRangeChartSeriesOptions[] = [];
        const series = [];
        const states = Object.keys(FDevIDs.state).filter(state => {
            return state !== 'null';
        }).map(state => {
            return [state, FDevIDs.state[state].name];
        });
        const data = {};
        states.forEach(state => {
            data[state[0]] = [];
        });
        allTimeSystems.forEach((system, index) => {
            systems.push(system);
            const previousStates = new Array(maxStatesConcurrent[index]);
            const tempBegin = new Array(maxStatesConcurrent[index]);
            history.filter(record => {
                return record.system === system;
            }).forEach(record => {
                if (record[stateType] && !_.isEqual(record[stateType].map(recordState => {
                    return recordState.state;
                }), previousStates)) {
                    const statesStarting = _.pull(_.difference(record[stateType].map(recordState => {
                        return recordState.state;
                    }), previousStates), undefined, null);
                    const statesEnding = _.pull(_.difference(previousStates, record[stateType].map(recordState => {
                        return recordState.state;
                    })), undefined, null);
                    statesEnding.forEach(state => {
                        const previousStateIndex = previousStates.indexOf(state);
                        data[state].push({
                            x: tempBegin[previousStateIndex],
                            x2: Date.parse(record.updated_at),
                            y: _.sum(maxStatesConcurrent.slice(0, index)) + previousStateIndex,
                            faction: system
                        });
                        previousStates[previousStateIndex] = null;
                    });
                    statesStarting.forEach(state => {
                        for (let i = 0; i < previousStates.length; i++) {
                            if (!previousStates[i]) {
                                previousStates[i] = state;
                                tempBegin[i] = Date.parse(record.updated_at);
                                break;
                            }
                        }
                    });
                }
            });
            previousStates.forEach((state, previousStateIndex) => {
                if (state) {
                    data[state].push({
                        x: tempBegin[previousStateIndex],
                        x2: Date.now(),
                        y: _.sum(maxStatesConcurrent.slice(0, index)) + previousStateIndex,
                        faction: system
                    });
                    previousStates[previousStateIndex] = null;
                }
            });
        });
        states.forEach(state => {
            series.push({
                name: state[1],
                pointWidth: 20,
                data: data[state[0]]
            });
        });
        const tickPositions = [-1];
        for (let i = 0; i < maxStatesConcurrent.length; i++) {
            tickPositions.push(tickPositions[i] + maxStatesConcurrent[i]);
        }
        let options = {
            chart: {
                height: 130 + _.sum(maxStatesConcurrent) * 40,
                type: 'xrange',
                events: {
                    render: function () {
                        var tickAbsolutePositions = this.yAxis[0].tickPositions.map(function (tickPosition) {
                            return +this.yAxis[0].ticks[tickPosition.toString()].gridLine.d.split(' ')[2]
                        }, this);
                        tickAbsolutePositions = [+this.yAxis[0].ticks['-1'].gridLine.d.split(' ')[2]].concat(tickAbsolutePositions);
                        var labelPositions = [];
                        for (var i = 1; i < tickAbsolutePositions.length; i++) {
                            labelPositions.push((tickAbsolutePositions[i] + tickAbsolutePositions[i - 1]) / 2);
                        }

                        systemsRegex.forEach(function (system, index) {
                            this.yAxis[0]
                                .labelGroup.element.childNodes[index]
                                .attributes.y.nodeValue = labelPositions[index] +
                                parseFloat(this.yAxis[0].labelGroup.element.childNodes[index].style['font-size']) / 2;
                        }, this);
                    }
                }
            },
            title: {
                text: `${stateTitle} Periods`
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Systems'
                },
                categories: systems,
                tickPositioner: function () {
                    return tickPositionsRegex;
                },
                startOnTick: false,
                reversed: true,
                labels: {
                    formatter: function () {
                        var chart = this.chart;
                        var axis = this.axis;
                        var label;

                        if (!chart.yaxisLabelIndex) {
                            chart.yaxisLabelIndex = 0;
                        }
                        if (this.value !== -1) {

                            label = axis.categories[chart.yaxisLabelIndex];
                            chart.yaxisLabelIndex++;

                            if (chart.yaxisLabelIndex === maxStatesConcurrentRegex.length) {
                                chart.yaxisLabelIndex = 0;
                            }

                            return label;
                        }
                    },
                },
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
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.faction}</b><br/>'
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
            url: `http://localhost:7801/`,
            formData: {
                options: un_eval(options).replace('systemsRegex', JSON.stringify(systems)).replace('tickPositionsRegex', JSON.stringify(tickPositions)).replace('maxStatesConcurrentRegex', JSON.stringify(maxStatesConcurrent)),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-${stateType}`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
}

router.get('/factions/happiness', async (req, res, next) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/factions`,
            qs: {
                name: req.query.name,
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax,
                systemDetails: 'true'
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\faction-happiness-chart.component.ts
        const history = responseObject.docs[0].history;
        const allSystems = [];
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
        const happiness = Object.keys(FDevIDs.happiness).map(happiness => {
            return [happiness, FDevIDs.happiness[happiness].name];
        });
        let i = 0;
        happiness.forEach(happiness => {
            const data = [];
            allSystems.forEach((system, index) => {
                let previousHappiness = '';
                let timeBegin = 0;
                let timeEnd = 0;
                history.forEach(record => {
                    if (record.system === system) {
                        if (previousHappiness !== record.happiness) {
                            if (record.happiness === happiness[0]) {
                                timeBegin = Date.parse(record.updated_at);
                            }
                            if (previousHappiness === happiness[0] && record.happiness !== happiness[0]) {
                                timeEnd = Date.parse(record.updated_at);
                                data.push({
                                    x: timeBegin,
                                    x2: timeEnd,
                                    y: index
                                });
                            }
                            previousHappiness = record.happiness;
                        }
                    }
                });
                if (previousHappiness === happiness[0]) {
                    data.push({
                        x: timeBegin,
                        x2: Date.now(),
                        y: index
                    });
                }
            });
            series.push({
                name: happiness[1],
                pointWidth: 20,
                data: data
            });
            i++;
        });
        let options = {
            chart: {
                height: 130 + allSystems.length * 40,
                type: 'xrange'
            },
            title: {
                text: 'Happiness Periods'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Systems'
                },
                categories: allSystems,
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
            url: `http://localhost:7801/`,
            formData: {
                options: JSON.stringify(options),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-happiness`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
});

router.get('/systems/influence', async (req, res, next) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/systems`,
            qs: {
                name: req.query.name,
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax,
                factionDetails: 'true',
                factionHistory: 'true'
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\system-influence-chart.component.ts
        const factionHistory = responseObject.docs[0].faction_history;
        const history = responseObject.docs[0].history;
        const allTimeFactions = [];
        factionHistory.forEach(record => {
            if (allTimeFactions.indexOf(record.faction_name) === -1) {
                allTimeFactions.push(record.faction_name);
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
            let lastRecord;
            factionHistory.forEach(record => {
                if (record.faction_name === faction) {
                    data.push([
                        Date.parse(record.updated_at),
                        Number.parseFloat((record.influence * 100).toFixed(2))
                    ]);
                    lastRecord = record;
                } else {
                    const indexInSystem = history.findIndex(element => {
                        return element.updated_at === record.updated_at;
                    });
                    if (indexInSystem !== -1 && history[indexInSystem].factions.findIndex(element => {
                        return element.name_lower === faction.toLowerCase();
                    }) === -1) {
                        data.push([Date.parse(record.updated_at), null]);
                    }
                }
            });
            const latestUpdate = responseObject.docs[0].factions.find(findFaction => {
                return findFaction.name === faction;
            })
            if (latestUpdate) {
                data.push([
                    Date.parse(latestUpdate.faction_details.faction_presence.updated_at),
                    Number.parseFloat((lastRecord.influence * 100).toFixed(2))
                ]);
            }
            series.push({
                name: faction,
                data: data
            });
        });
        let options = {
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Influence'
                }
            },
            title: {
                text: 'Influence Trend'
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
            url: `http://localhost:7801/`,
            formData: {
                options: JSON.stringify(options),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-infleunce`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
});

router.get('/systems/state', async (req, res, next) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/systems`,
            qs: {
                name: req.query.name,
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax,
                factionDetails: 'true',
                factionHistory: 'true'
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\system-state-chart.component.ts
        const factionHistory = responseObject.docs[0].faction_history;
        const allTimeFactions = [];
        factionHistory.forEach(record => {
            if (allTimeFactions.indexOf(record.faction_name) === -1) {
                allTimeFactions.push(record.faction_name);
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
                let previousState = '';
                let timeBegin = 0;
                let timeEnd = 0;
                factionHistory.forEach(record => {
                    if (record.faction_name === faction) {
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
                height: 130 + allTimeFactions.length * 40,
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
                categories: allTimeFactions,
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
            url: `http://localhost:7801/`,
            formData: {
                options: JSON.stringify(options),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-state`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
});

router.get('/systems/active', (req, res, next) => {
    systemActivePendingRecovering(req, res, next, 'active');
});

router.get('/systems/pending', (req, res, next) => {
    systemActivePendingRecovering(req, res, next, 'pending');
});

router.get('/systems/recovering', (req, res, next) => {
    systemActivePendingRecovering(req, res, next, 'recovering');
});

let systemActivePendingRecovering = async (req, res, next, type) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/systems`,
            qs: {
                name: req.query.name,
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax,
                factionDetails: 'true',
                factionHistory: 'true'
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\system-a-p-r-state-chart.component.ts
        let stateType;
        let stateTitle;
        switch (type) {
            case 'active':
                stateType = 'active_states';
                stateTitle = 'Active State';
                break;
            case 'pending':
                stateType = 'pending_states';
                stateTitle = 'Pending State';
                break;
            case 'recovering':
                stateType = 'recovering_states';
                stateTitle = 'Recovering State';
                break;
            default:
                stateType = 'pending_states';
                stateTitle = 'Pending State';
        }
        const allTimeFactions = [];
        const allTimeStates = [];
        const maxStatesConcurrent = [];
        const factions = [];
        const factionHistory = responseObject.docs[0].faction_history;
        factionHistory.forEach(record => {
            if (allTimeFactions.indexOf(record.faction_name) === -1) {
                allTimeFactions.push(record.faction_name);
            }
        });
        allTimeFactions.forEach((faction, index) => {
            const allStates = [];
            let maxStates = 0;
            factionHistory.forEach((record, recordIndex, records) => {
                if (record.faction_name === faction) {
                    if (record[stateType].length === 0) {
                        records[recordIndex][stateType].push({
                            state: 'none',
                            trend: 0
                        });
                    }
                    record[stateType].forEach(recordState => {
                        if (allStates.indexOf(recordState.state) === -1) {
                            allStates.push(recordState.state);
                        }
                    });
                    maxStates = record[stateType].length > maxStates ? record[stateType].length : maxStates;
                }
            });
            allTimeStates.push(allStates);
            if (maxStates === 0) {
                maxStates = 1;
            }
            maxStatesConcurrent.push(maxStates);
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
        // const series: XRangeChartSeriesOptions[] = [];
        const series = [];
        const states = Object.keys(FDevIDs.state).filter(state => {
            return state !== 'null';
        }).map(state => {
            return [state, FDevIDs.state[state].name];
        });
        const data = {};
        states.forEach(state => {
            data[state[0]] = [];
        });
        allTimeFactions.forEach((faction, index) => {
            factions.push(faction);
            const previousStates = new Array(maxStatesConcurrent[index]);
            const tempBegin = new Array(maxStatesConcurrent[index]);
            factionHistory.filter(record => {
                return record.faction_name === faction;
            }).forEach(record => {
                if (record[stateType] && !_.isEqual(record[stateType].map(recordState => {
                    return recordState.state;
                }), previousStates)) {
                    const statesStarting = _.pull(_.difference(record[stateType].map(recordState => {
                        return recordState.state;
                    }), previousStates), undefined, null);
                    const statesEnding = _.pull(_.difference(previousStates, record[stateType].map(recordState => {
                        return recordState.state;
                    })), undefined, null);
                    statesEnding.forEach(state => {
                        const previousStateIndex = previousStates.indexOf(state);
                        data[state].push({
                            x: tempBegin[previousStateIndex],
                            x2: Date.parse(record.updated_at),
                            y: _.sum(maxStatesConcurrent.slice(0, index)) + previousStateIndex,
                            faction: faction
                        });
                        previousStates[previousStateIndex] = null;
                    });
                    statesStarting.forEach(state => {
                        for (let i = 0; i < previousStates.length; i++) {
                            if (!previousStates[i]) {
                                previousStates[i] = state;
                                tempBegin[i] = Date.parse(record.updated_at);
                                break;
                            }
                        }
                    });
                }
            });
            previousStates.forEach((state, previousStateIndex) => {
                if (state) {
                    data[state].push({
                        x: tempBegin[previousStateIndex],
                        x2: Date.now(),
                        y: _.sum(maxStatesConcurrent.slice(0, index)) + previousStateIndex,
                        faction: faction
                    });
                    previousStates[previousStateIndex] = null;
                }
            });
        });
        states.forEach(state => {
            series.push({
                name: state[1],
                pointWidth: 20,
                data: data[state[0]]
            });
        });
        const tickPositions = [-1];
        for (let i = 0; i < maxStatesConcurrent.length; i++) {
            tickPositions.push(tickPositions[i] + maxStatesConcurrent[i]);
        }
        let options = {
            chart: {
                height: 130 + _.sum(maxStatesConcurrent) * 40,
                type: 'xrange',
                events: {
                    render: function () {
                        var tickAbsolutePositions = this.yAxis[0].tickPositions.map(function (tickPosition) {
                            return +this.yAxis[0].ticks[tickPosition.toString()].gridLine.d.split(' ')[2]
                        }, this);
                        tickAbsolutePositions = [+this.yAxis[0].ticks['-1'].gridLine.d.split(' ')[2]].concat(tickAbsolutePositions);
                        var labelPositions = [];
                        for (var i = 1; i < tickAbsolutePositions.length; i++) {
                            labelPositions.push((tickAbsolutePositions[i] + tickAbsolutePositions[i - 1]) / 2);
                        }

                        factionsRegex.forEach(function (faction, index) {
                            this.yAxis[0]
                                .labelGroup.element.childNodes[index]
                                .attributes.y.nodeValue = labelPositions[index] +
                                parseFloat(this.yAxis[0].labelGroup.element.childNodes[index].style['font-size']) / 2;
                        }, this);
                    }
                }
            },
            title: {
                text: `${stateTitle} Periods`
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Factions'
                },
                categories: factions,
                tickPositioner: function () {
                    return tickPositionsRegex;
                },
                startOnTick: false,
                reversed: true,
                labels: {
                    formatter: function () {
                        var chart = this.chart;
                        var axis = this.axis;
                        var label;

                        if (!chart.yaxisLabelIndex) {
                            chart.yaxisLabelIndex = 0;
                        }
                        if (this.value !== -1) {

                            label = axis.categories[chart.yaxisLabelIndex];
                            chart.yaxisLabelIndex++;

                            if (chart.yaxisLabelIndex === maxStatesConcurrentRegex.length) {
                                chart.yaxisLabelIndex = 0;
                            }

                            return label;
                        }
                    }
                },
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
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.faction}</b><br/>'
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
            url: `http://localhost:7801/`,
            formData: {
                options: un_eval(options).replace('factionsRegex', JSON.stringify(factions)).replace('tickPositionsRegex', JSON.stringify(tickPositions)).replace('maxStatesConcurrentRegex', JSON.stringify(maxStatesConcurrent)),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-${stateType}`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
}

router.get('/systems/happiness', async (req, res, next) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/systems`,
            qs: {
                name: req.query.name,
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax,
                factionDetails: 'true',
                factionHistory: 'true'
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\system-happiness-chart.component.ts
        const factionHistory = responseObject.docs[0].faction_history;
        const allTimeFactions = [];
        factionHistory.forEach(record => {
            if (allTimeFactions.indexOf(record.faction_name) === -1) {
                allTimeFactions.push(record.faction_name);
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
        const happiness = Object.keys(FDevIDs.happiness).map(happiness => {
            return [happiness, FDevIDs.happiness[happiness].name];
        });
        let i = 0;
        happiness.forEach(happiness => {
            const data = [];
            allTimeFactions.forEach((faction, index) => {
                let previousHappiness = '';
                let timeBegin = 0;
                let timeEnd = 0;
                factionHistory.forEach(record => {
                    if (record.faction_name === faction) {
                        if (previousHappiness !== record.happiness) {
                            if (record.happiness === happiness[0]) {
                                timeBegin = Date.parse(record.updated_at);
                            }
                            if (previousHappiness === happiness[0] && record.happiness !== happiness[0]) {
                                timeEnd = Date.parse(record.updated_at);
                                data.push({
                                    x: timeBegin,
                                    x2: timeEnd,
                                    y: index
                                });
                            }
                            previousHappiness = record.happiness;
                        }
                    }
                });
                if (previousHappiness === happiness[0]) {
                    data.push({
                        x: timeBegin,
                        x2: Date.now(),
                        y: index
                    });
                }
            });
            series.push({
                name: happiness[1],
                pointWidth: 20,
                data: data
            });
            i++;
        });
        let options = {
            chart: {
                height: 130 + allTimeFactions.length * 40,
                type: 'xrange'
            },
            title: {
                text: 'Happiness Periods'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Factions'
                },
                categories: allTimeFactions,
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
            url: `http://localhost:7801/`,
            formData: {
                options: JSON.stringify(options),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-happiness`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
});

router.get('/tick', async (req, res, next) => {
    try {
        let requestOptions = {
            url: `${processVars.protocol}://${processVars.host}/api/ebgs/v5/ticks`,
            qs: {
                timeMin: req.query.timeMin,
                timeMax: req.query.timeMax
            },
            json: true,
            resolveWithFullResponse: true
        };
        let response = await request.get(requestOptions);
        let responseObject = {};
        if (response.statusCode === 200) {
            responseObject = response.body;
            if (responseObject.total <= 0) {
                throw new Error(response);
            }
        } else {
            throw new Error(response);
        }
        // Copied over from src\app\charts\tick-chart.component.ts
        const tickData = responseObject;
        const data = [];
        const series = [];
        const firstTick = tickData[tickData.length - 1];
        tickData.forEach(tick => {
            const tickMoment = moment(tick.time);
            const firstTickMoment = moment(firstTick.time);
            const normalisedTime = moment(`${firstTickMoment.format('YYYY-MM-DD')} ${tickMoment.format('HH:mm:ss:SSSZZ')}`, 'YYYY-MM-DD HH:mm:ss:SSSZZ');
            data.push([
                Date.parse(tick.updated_at),
                Date.parse(normalisedTime.toISOString())
            ])
        });
        series.push({
            name: 'Tick',
            data: data
        });
        let options = {
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Time (UTC)'
                },
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%H:%M',
                    second: '%H:%M',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%H:%M',
                    week: '%H:%M',
                    month: '%H:%M',
                    year: '%H:%M'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
                pointFormatter: function () {
                    console.log(this);
                    return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${moment(this.y).utc().format('HH:mm')} UTC</b><br/>`
                }
            },
            title: {
                text: 'Tick Trend'
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
            url: `http://localhost:7801/`,
            formData: {
                options: JSON.stringify(options),
                type: 'image/png',
                filename: `${req.query.name}-${req.query.timeMin}-${req.query.timeMax}-state`,
                resources: JSON.stringify({
                    js: `theme = ${JSON.stringify(highchartsCurrentTheme)};Highcharts.setOptions(theme);`
                }),
                scale: 2
            },
            encoding: null,
            resolveWithFullResponse: true
        }
        let imageResponse = await request.post(highchartsRequestOptions);
        res.set('Content-Type', imageResponse.headers['content-type'])
        res.set('Content-Disposition', imageResponse.headers['content-disposition'])
        res.send(imageResponse.body);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
