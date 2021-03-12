import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EBGSFactionSchemaDetailed } from '../typings';
// import { Options, XRangeChartSeriesOptions, DataPoint, SeriesChart } from 'highcharts';
import { Chart } from 'angular-highcharts';
import { ThemeService } from '../services/theme.service';
import { IngameIdsService } from '../services/ingameIds.service';

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
    selector: 'app-faction-happiness-chart',
    templateUrl: './faction-happiness-chart.component.html'
})
export class FactionHappinessChartComponent implements OnInit, OnChanges {
    @Input() factionData: EBGSFactionSchemaDetailed;
    // options: Options;
    options: any;
    chart: Chart;

    constructor(
        private themeService: ThemeService,
        private ingameIdsService: IngameIdsService
    ) {
    }

    ngOnInit(): void {
        this.createChart()
    }

    async createChart() {
        // Todo: Copied over to server\routes\chart_generator.js
        const allSystems: string[] = [];
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
        const FDevIDs = await this.ingameIdsService.getAllIds().toPromise();
        const happinesses: [string, string][] = Object.keys(FDevIDs.happiness).map(happiness => {
            return [happiness, FDevIDs.happiness[happiness].name];
        }) as [string, string][];
        let i = 0;
        happinesses.forEach(happiness => {
            // const data: DataPoint[] = [];
            const data: any[] = [];
            allSystems.forEach((system, index) => {
                let previousHappiness = '';
                let timeBegin = 0;
                let timeEnd = 0;
                this.factionData.history.forEach(record => {
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
        this.options = {
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
        this.themeService.theme$.subscribe(theme => {
            this.chart = new Chart(this.options);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName === 'factionData' && changes[propName].currentValue) {
                this.createChart();
            }
        }
    }
}
