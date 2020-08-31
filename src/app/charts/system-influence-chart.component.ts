import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EBGSFactionHistoryDetailed, EBGSSystemSchemaDetailed } from '../typings';
// import { Options, LineChartSeriesOptions } from 'highcharts';
import { Chart } from 'angular-highcharts';
import { ThemeService } from '../services/theme.service';

@Component({
    selector: 'app-system-influence-chart',
    templateUrl: './system-influence-chart.component.html'
})

export class SystemInfluenceChartComponent implements OnInit, OnChanges {
    @Input() systemData: EBGSSystemSchemaDetailed;
    options: any;
    chart: Chart;

    constructor(private themeService: ThemeService) {
    }

    ngOnInit(): void {
        this.createChart();
    }

    createChart(): void {
        // Copied over to server\routes\chart_generator.js
        const allTimeFactions: string[] = [];
        this.systemData.faction_history.forEach(record => {
            if (allTimeFactions.indexOf(record.faction_name) === -1) {
                allTimeFactions.push(record.faction_name);
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
        const series: any[] = [];
        allTimeFactions.forEach(faction => {
            const data: [number, number][] = [];
            let lastRecord: EBGSFactionHistoryDetailed;
            this.systemData.faction_history.forEach(record => {
                if (record.faction_name === faction) {
                    data.push([
                        Date.parse(record.updated_at),
                        Number.parseFloat((record.influence * 100).toFixed(2))
                    ]);
                    lastRecord = record;
                } else {
                    const indexInSystem = this.systemData.history.findIndex(element => {
                        return element.updated_at === record.updated_at;
                    });
                    if (indexInSystem !== -1 && this.systemData.history[indexInSystem].factions.findIndex(element => {
                        return element.name_lower === faction.toLowerCase();
                    }) === -1) {
                        data.push([Date.parse(record.updated_at), null]);
                    }
                }
            });
            const latestUpdate = this.systemData.factions.find(findFaction => {
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
        this.options = {
            xAxis: {type: 'datetime'},
            yAxis: {
                title: {
                    text: 'Influence'
                }
            },
            title: {text: 'Influence Trend'},
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
