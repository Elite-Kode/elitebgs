import { Component, OnInit, Input } from '@angular/core';
import { EBGSFactionV3Schema } from '../../typings';
import { FDevIDs } from '../../utilities/fdevids';
// import { Options, XRangeChartSeriesOptions, DataPoint, SeriesChart } from 'highcharts';
import { Chart } from 'angular-highcharts';

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
    selector: 'app-faction-state-chart',
    templateUrl: './faction-state-chart.component.html',
    styleUrls: ['./faction-state-chart.component.scss']
})
export class FactionStateChartComponent implements OnInit {
    @Input() factionData: EBGSFactionV3Schema;
    // options: Options;
    options: any;
    chart: Chart;
    constructor() { }

    ngOnInit(): void {
        const allSystems: string[] = [];
        const systems: string[] = [];
        this.factionData.history.forEach(record => {
            if (allSystems.indexOf(record.system) === -1) {
                allSystems.push(record.system);
            }
        });
        this.factionData.history.sort((a, b) => {
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
        states.forEach(state => {
            // const data: DataPoint[] = [];
            const data: any[] = [];
            allSystems.forEach((system, index) => {
                systems.push(system);
                let previousState = '';
                let timeBegin = 0;
                let timeEnd = 0;
                this.factionData.history.forEach(record => {
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
        });
        this.options = {
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
                    grouping: false,
                    dataLabels: {
                        align: 'center',
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            series: series
        };
        this.chart = new Chart(this.options);
    }
}
