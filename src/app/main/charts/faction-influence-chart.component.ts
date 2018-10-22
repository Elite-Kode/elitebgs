import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EBGSFactionV3Schema } from '../../typings';
import { Options, LineChartSeriesOptions } from 'highcharts';
import { Chart } from 'angular-highcharts';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-faction-influence-chart',
    templateUrl: './faction-influence-chart.component.html'
})

export class FactionInfluenceChartComponent implements OnInit, OnChanges {
    @Input() factionData: EBGSFactionV3Schema;
    options: Options;
    chart: Chart;
    constructor(private themeService: ThemeService) { }

    ngOnInit(): void {
        this.createChart();
    }

    createChart(): void {
        const history = this.factionData.history;
        const allSystems: string[] = [];
        history.forEach(element => {
            if (allSystems.indexOf(element.system) === -1) {
                allSystems.push(element.system);
            }
        });
        const series: LineChartSeriesOptions[] = [];
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
            const data: [number, number][] = [];
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
        this.options = {
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
