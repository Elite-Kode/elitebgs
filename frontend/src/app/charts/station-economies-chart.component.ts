import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EBGSStationSchemaDetailed } from '../typings';
// import { Options, PieChartSeriesOptions } from 'highcharts';
import { Chart } from 'angular-highcharts';
import { ThemeService } from '../services/theme.service';

@Component({
    selector: 'app-station-economies-chart',
    templateUrl: './station-economies-chart.component.html'
})

export class StationEconomiesChartComponent implements OnInit, OnChanges {
    @Input() stationData: EBGSStationSchemaDetailed;
    options: any;
    chart: Chart;

    constructor(private themeService: ThemeService) {
    }

    ngOnInit(): void {
        this.createChart();
    }

    createChart(): void {
        // Todo: Copied over to server\routes\chart_generator.js
        const economies = this.stationData ? this.stationData.all_economies : [];
        const data: any[] = [];
        economies.forEach(element => {
            data.push({
                name: element.name,
                y: element.proportion
            })
        });
        let series: any[] = [];
        series = [{
            name: 'Economies',
            data: data
        }]
        this.options = {
            chart: {
                type: 'pie'
            },
            title: null,
            series: series,
            exporting: {
                enabled: false
            }
        };
        this.themeService.theme$.subscribe(theme => {
            this.chart = new Chart(this.options);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName === 'stationData' && changes[propName].currentValue) {
                this.createChart();
            }
        }
    }
}
