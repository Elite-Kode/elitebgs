import { Component, OnInit, Input } from '@angular/core';
import { EBGSSystemChart } from '../../typings';
import { FDevIDs } from '../../utilities/fdevids';
// import { Options, XRangeChartSeriesOptions, DataPoint, SeriesChart } from 'highcharts';
import { Chart } from 'angular-highcharts';
import { ThemeService } from '../../services/theme.service';

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
    selector: 'app-system-state-chart',
    templateUrl: './system-state-chart.component.html'
})
export class SystemStateChartComponent implements OnInit {
    @Input() systemData: EBGSSystemChart;
    // options: Options;
    options: any;
    chart: Chart;
    constructor(private themeService: ThemeService) { }

    ngOnInit(): void {
        const allTimeFactions: string[] = [];
        const factions: string[] = [];
        this.systemData.faction_history.forEach(record => {
            if (allTimeFactions.indexOf(record.faction) === -1) {
                allTimeFactions.push(record.faction);
            }
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
        const colours = [
            '#7cb5ec',
            '#434348',
            '#90ed7d',
            '#f7a35c',
            '#8085e9',
            '#f15c80',
            '#e4d354',
            '#2b908f',
            '#f45b5b',
            '#91e8e1',
            '#3ab795',
            '#bce784',
            '#ee6352'
        ];
        const states: [string, string][] = Object.keys(FDevIDs.state).filter(state => {
            return state !== 'null';
        }).map(state => {
            return [state, FDevIDs.state[state].name];
        }) as [string, string][];
        let i = 0;
        states.forEach(state => {
            // const data: DataPoint[] = [];
            const data: any[] = [];
            allTimeFactions.forEach((faction, index) => {
                factions.push(faction);
                let previousState = '';
                let timeBegin = 0;
                let timeEnd = 0;
                this.systemData.faction_history.forEach(record => {
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
                data: data,
                color: colours[i]
            });
            i++;
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
                    text: 'Factions'
                },
                categories: factions,
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
                    },
                    colorByPoint: false
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size: 0.85em">{point.x} - {point.x2}</span><br/>',
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
            },
            series: series
        };
        this.chart = new Chart(this.options);
        this.themeService.theme$.subscribe(theme => {
            this.chart = new Chart(this.options);
        });
    }
}
