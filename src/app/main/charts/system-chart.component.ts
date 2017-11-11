import { Component, OnInit, Input } from '@angular/core';
import { EBGSFactionV3Schema, EBGSSystemV3Schema } from '../../typings';
import { Options, IndividualSeriesOptions } from 'highcharts';
import { FactionsService } from '../../services/factions.service';
import { HttpErrorResponse } from '@angular/common/http';

type EBGSFactionHistory = EBGSFactionV3Schema['history'][0];

interface EBGSFactionHistoryList extends EBGSFactionHistory {
    faction: string;
}

@Component({
    selector: 'app-system-chart',
    templateUrl: './system-chart.component.html'
})

export class SystemChartComponent implements OnInit {
    @Input() systemData: EBGSSystemV3Schema;
    options: Options;
    constructor(
        private factionsService: FactionsService
    ) { }

    ngOnInit(): void {
        let allTimeFactions: string[] = [];
        if (this.systemData.history.length === 0) {
            allTimeFactions = this.systemData.factions.map((system, index, allSystems) => {
                return system.name_lower;
            });
        } else {
            this.systemData.history.forEach(element => {
                element.factions.forEach(faction => {
                    if (allTimeFactions.indexOf(faction.name_lower) === -1) {
                        allTimeFactions.push(faction.name_lower);
                    }
                });
            });
        }
        const allFactionsGet: Promise<EBGSFactionV3Schema>[] = [];
        allTimeFactions.forEach(faction => {
            allFactionsGet.push(new Promise((resolve, reject) => {
                this.factionsService
                    .getHistory(faction, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString())
                    .subscribe(factions => {
                        resolve(factions.docs[0]);
                    },
                    (err: HttpErrorResponse) => {
                        reject(err);
                    });
            }));
        });
        Promise.all(allFactionsGet)
            .then(factions => {
                const allHistory: EBGSFactionHistoryList[] = [];
                factions.forEach(faction => {
                    faction.history.forEach(history => {
                        const historyList: EBGSFactionHistoryList = history as EBGSFactionHistoryList;
                        if (historyList.system_lower === this.systemData.name_lower) {
                            historyList.faction = faction.name_lower;
                            allHistory.push(historyList);
                        }
                    });
                });
                allHistory.sort((a, b) => {
                    if (a.updated_at < b.updated_at) {
                        return -1;
                    } else if (a.updated_at > b.updated_at) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                const series: IndividualSeriesOptions[] = [];
                factions.forEach(faction => {
                    const data: [number, number][] = [];
                    allHistory.forEach(history => {
                        if (history.faction === faction.name_lower) {
                            data.push([
                                Date.parse(history.updated_at),
                                Number.parseFloat((history.influence * 100).toFixed(2))
                            ]);
                        } else {
                            const indexInSystem = this.systemData.history.findIndex(element => {
                                return element.updated_at === history.updated_at;
                            });
                            if (indexInSystem !== -1 && this.systemData.history[indexInSystem].factions.findIndex(element => {
                                return element.name_lower === faction.name_lower;
                            }) === -1) {
                                data.push([Date.parse(history.updated_at), null]);
                            }
                        }
                    });
                    series.push({
                        name: faction.name,
                        data: data
                    });
                });
                this.options = {
                    xAxis: { type: 'datetime' },
                    title: { text: 'Influence trend' },
                    series: series
                };
            })
            .catch(err => {
                console.log(err);
            });
    }
}
