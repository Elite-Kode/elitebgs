import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TickV4 } from '../typings';
import { Options, LineChartSeriesOptions } from 'highcharts';
import { Chart } from 'angular-highcharts';
import { ThemeService } from '../services/theme.service';
import * as moment from 'moment';

@Component({
    selector: 'app-tick-chart',
    templateUrl: './tick-chart.component.html'
})
export class TickChartComponent implements OnInit, OnChanges {
    @Input() tickData: TickV4;
    options: Options;
    chart: Chart;
    constructor(private themeService: ThemeService) { }

    ngOnInit(): void {
        this.createChart();
    }

    createChart(): void {
        // Copied over to server\routes\chart_generator.js
        const data: [number, number][] = [];
        const series: LineChartSeriesOptions[] = [];
        const firstTick = this.tickData[this.tickData.length - 1];
        this.tickData.forEach(tick => {
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
        this.options = {
            xAxis: { type: 'datetime' },
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
            title: { text: 'Tick Trend' },
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
            if (propName === 'tickData' && changes[propName].currentValue) {
                this.createChart();
            }
        }
    }
}
