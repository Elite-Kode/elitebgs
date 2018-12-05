import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EBGSSystemChart } from '../../typings';
import { FDevIDs } from '../../utilities/fdevids';
// import { Options, XRangeChartSeriesOptions, DataPoint, SeriesChart } from 'highcharts';
import { Chart } from 'angular-highcharts';
import { ThemeService } from '../../services/theme.service';
import isEqual from 'lodash-es/isEqual';
import difference from 'lodash-es/difference';
import pull from 'lodash-es/pull';
import sum from 'lodash-es/sum';

// declare module 'highcharts' {
//     interface XRangeChart extends SeriesChart {
//         borderRadius?: number;
//         grouping?: boolean;
//     }

//     interface PlotOptions {
//         xrange: XRangeChart;
//     }

//     interface DataPoint {
//         x2: number
//     }

//     interface XRangeChartSeriesOptions extends IndividualSeriesOptions, SeriesChart { }
// }

@Component({
    selector: 'app-system-a-p-r-state-chart',
    templateUrl: './system-a-p-r-state-chart.component.html'
})
export class SystemAPRStateChartComponent implements OnInit, OnChanges {
    @Input() systemData: EBGSSystemChart;
    @Input() type: string;
    // options: Options;
    options: any;
    chart: Chart;
    constructor(private themeService: ThemeService) { }

    ngOnInit(): void {
        this.createChart();
    }

    createChart(): void {
        // Copied over to server\routes\chart_generator.js
        let stateType;
        let stateTitle;
        switch (this.type) {
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
        const allTimeFactions: string[] = [];
        const allTimeStates: string[][] = [];
        const maxStatesConcurrent: number[] = [];
        const factions: string[] = [];
        this.systemData.faction_history.forEach(record => {
            if (allTimeFactions.indexOf(record.faction) === -1) {
                allTimeFactions.push(record.faction);
            }
        });
        allTimeFactions.forEach((faction, index) => {
            const allStates: string[] = [];
            let maxStates = 0;
            this.systemData.faction_history.forEach((record, recordIndex, records) => {
                if (record.faction === faction) {
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
        this.systemData.faction_history.sort((a, b) => {
            if (a.updated_at < b.updated_at) {
                return -1;
            } else if (a.updated_at > b.updated_at) {
                return 1;
            } else {
                return 0;
            }
        });
        // const series: XRangeChartSeriesOptions[] = [];
        const series: any[] = [];
        const states: [string, string][] = Object.keys(FDevIDs.state).filter(state => {
            return state !== 'null';
        }).map(state => {
            return [state, FDevIDs.state[state].name];
        }) as [string, string][];
        const data = {};
        states.forEach(state => {
            data[state[0]] = [];
        });
        allTimeFactions.forEach((faction, index) => {
            factions.push(faction);
            const previousStates: string[] = new Array(maxStatesConcurrent[index]);
            const tempBegin: number[] = new Array(maxStatesConcurrent[index]);
            this.systemData.faction_history.filter(record => {
                return record.faction === faction;
            }).forEach(record => {
                if (!isEqual(record[stateType].map(recordState => {
                    return recordState.state;
                }), previousStates)) {
                    const statesStarting: string[] = pull(difference(record[stateType].map(recordState => {
                        return recordState.state;
                    }), previousStates), undefined, null);
                    const statesEnding: string[] = pull(difference(previousStates, record[stateType].map(recordState => {
                        return recordState.state;
                    })), undefined, null);
                    statesEnding.forEach(state => {
                        const previousStateIndex = previousStates.indexOf(state);
                        data[state].push({
                            x: tempBegin[previousStateIndex],
                            x2: Date.parse(record.updated_at),
                            y: sum(maxStatesConcurrent.slice(0, index)) + previousStateIndex,
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
                        y: sum(maxStatesConcurrent.slice(0, index)) + previousStateIndex,
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
        this.options = {
            chart: {
                height: 130 + sum(maxStatesConcurrent) * 40,
                type: 'xrange',
                events: {
                    render() {
                        let tickAbsolutePositions = this.yAxis[0].tickPositions.map(tickPosition => {
                            return +this.yAxis[0].ticks[tickPosition.toString()].gridLine.d.split(' ')[2]
                        });
                        tickAbsolutePositions = [+this.yAxis[0].ticks['-1'].gridLine.d.split(' ')[2]].concat(tickAbsolutePositions);
                        const labelPositions = [];
                        for (let i = 1; i < tickAbsolutePositions.length; i++) {
                            labelPositions.push((tickAbsolutePositions[i] + tickAbsolutePositions[i - 1]) / 2);
                        }

                        factions.forEach((faction, index) => {
                            this.yAxis[0]
                                .labelGroup.element.childNodes[index]
                                .attributes.y.nodeValue = labelPositions[index]
                                + parseFloat(this.yAxis[0].labelGroup.element.childNodes[index].style['font-size']) / 2;
                        });
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
                tickPositioner() {
                    return tickPositions;
                },
                startOnTick: false,
                reversed: true,
                labels: {
                    formatter() {
                        const chart = this.chart;
                        const axis = this.axis;
                        let label;

                        if (!chart.yaxisLabelIndex) {
                            chart.yaxisLabelIndex = 0;
                        }
                        if (this.value !== -1) {

                            label = axis.categories[chart.yaxisLabelIndex];
                            chart.yaxisLabelIndex++;

                            if (chart.yaxisLabelIndex === maxStatesConcurrent.length) {
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
        this.themeService.theme$.subscribe(theme => {
            this.chart = new Chart(this.options);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName === 'systemData' && changes[propName].currentValue) {
                this.createChart();
            }
        }
    }
}
