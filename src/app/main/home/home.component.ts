import { Component, OnInit, HostBinding } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import { FactionsService } from '../../services/factions.service';
import { SystemsService } from '../../services/systems.service';
import { EBGSFactionsV3, EBGSUser, EBGSFactionV3Schema, EBGSSystemV3Schema } from '../../typings';
import { Options } from 'highcharts';

interface EBGSFactionChart extends EBGSFactionV3Schema {
    factionOptions: Options;
}

type EBGSSystemFaction = EBGSSystemV3Schema['factions'][0];

interface EBGSSystemFactionChart extends EBGSSystemFaction {
    influence: number;
    state: string;
    pending_states: {
        state: string;
        trend: number;
    }[];
    recovering_states: {
        state: string;
        trend: number;
    }[];
}

interface ChartSeries {
    name: string;
    data: [number, number][];
}

interface EBGSSystemChart extends EBGSSystemV3Schema {
    systemOptions: Options;
    factions: EBGSSystemFactionChart[];
}

type EBGSFactionHistory = EBGSFactionV3Schema['history'][0];

interface EBGSFactionHistoryList extends EBGSFactionHistory {
    faction: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    user: EBGSUser;
    factions: EBGSFactionChart[] = [];
    systems: EBGSSystemChart[] = [];
    monitoredSystems: string[] = [];
    factionModal: boolean;
    systemModal: boolean;
    constructor(
        private authenticationService: AuthenticationService,
        private factionsService: FactionsService,
        private systemsService: SystemsService
    ) { }

    ngOnInit(): void {
        this.getAuthentication();
        const tyty: EBGSSystemFactionChart = {} as EBGSSystemFactionChart;
        tyty.name_lower = 'fdfdf';
        tyty.influence = 9;
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => {
                this.isAuthenticated = status;
                if (this.isAuthenticated) {
                    this.getUser();
                } else {
                    this.user = {} as EBGSUser;
                    this.factions = [];
                    this.systems = [];
                }
            });
    }

    getUser() {
        this.authenticationService
            .getUser()
            .subscribe(user => {
                this.user = user;
                this.addSystems();
                this.getFactions();
            });
    }

    getFactions() {
        const allFactionsGet: Promise<EBGSFactionsV3>[] = [];
        this.user.factions.forEach(faction => {
            allFactionsGet.push(new Promise((resolve, reject) => {
                this.factionsService
                    .getHistory(faction.name, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString())
                    .subscribe(factions => {
                        resolve(factions);
                        factions.docs.forEach(gotFaction => {
                            const gotFactionChart: EBGSFactionChart = gotFaction as EBGSFactionChart;
                            const history = gotFactionChart.history;
                            const allSystems: string[] = [];
                            history.forEach(element => {
                                if (allSystems.indexOf(element.system) === -1) {
                                    allSystems.push(element.system);
                                }
                            });
                            const series: ChartSeries[] = [];
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
                            gotFactionChart.factionOptions = {
                                xAxis: { type: 'datetime' },
                                title: { text: 'Influence trend' },
                                series: series
                            };
                            this.factions.push(gotFactionChart);
                        });
                    },
                    (err: HttpErrorResponse) => {
                        reject(err);
                    });
            }));
        });
        Promise.all(allFactionsGet)
            .then(factions => {
                factions.forEach(faction => {
                    faction.docs.forEach(factionDoc => {
                        factionDoc.faction_presence.forEach(system => {
                            if (this.monitoredSystems.indexOf(system.system_name) === -1) {
                                this.monitoredSystems.push(system.system_name);
                            }
                        });
                    });
                });
                this.getSystems();
            })
            .catch(err => {
                console.log(err);
            });
    }

    getSystems() {
        this.monitoredSystems.forEach(system => {
            this.systemsService
                .getHistory(system, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString())
                .subscribe(systems => {     // Stores search results of each monitored system
                    systems.docs.forEach(gotSystem => {     // Each result might have multiple docs
                        const allTimeFactions: string[] = [];
                        gotSystem.history.forEach(element => {
                            element.factions.forEach(faction => {
                                if (allTimeFactions.indexOf(faction.name_lower) === -1) {
                                    allTimeFactions.push(faction.name_lower);
                                }
                            });
                        });
                        const gotSystemChart: EBGSSystemChart = gotSystem as EBGSSystemChart;
                        const allFactionsGet: Promise<EBGSFactionV3Schema>[] = [];
                        allTimeFactions.forEach(faction => {
                            allFactionsGet.push(new Promise((resolve, reject) => {
                                this.factionsService
                                    .getHistory(faction, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString())
                                    .subscribe(factions => {
                                        const indexOfFactionInSystem = gotSystemChart.factions.findIndex(factionElement => {
                                            return factionElement.name_lower === faction;
                                        });
                                        if (indexOfFactionInSystem !== -1) {
                                            const indexOfSystem = factions.docs[0].faction_presence.findIndex(presenceElement => {
                                                return presenceElement.system_name_lower === gotSystem.name_lower;
                                            });
                                            if (indexOfSystem !== -1) {
                                                gotSystemChart
                                                    .factions[indexOfFactionInSystem]
                                                    .influence = factions.docs[0].faction_presence[indexOfSystem].influence;
                                                gotSystemChart
                                                    .factions[indexOfFactionInSystem]
                                                    .state = factions.docs[0].faction_presence[indexOfSystem].state;
                                                gotSystemChart
                                                    .factions[indexOfFactionInSystem]
                                                    .pending_states = factions.docs[0].faction_presence[indexOfSystem].pending_states;
                                                gotSystemChart
                                                    .factions[indexOfFactionInSystem]
                                                    .recovering_states = factions.docs[0].faction_presence[indexOfSystem].recovering_states;
                                            }
                                        }
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
                                        if (historyList.system_lower === gotSystem.name_lower) {
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
                                const series: ChartSeries[] = [];
                                factions.forEach(faction => {
                                    const data: [number, number][] = [];
                                    allHistory.forEach(history => {
                                        if (history.faction === faction.name_lower) {
                                            data.push([
                                                Date.parse(history.updated_at),
                                                Number.parseFloat((history.influence * 100).toFixed(2))
                                            ]);
                                        } else {
                                            const indexInSystem = gotSystem.history.findIndex(element => {
                                                return element.updated_at === history.updated_at;
                                            });
                                            if (indexInSystem !== -1 && gotSystem.history[indexInSystem].factions.findIndex(element => {
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
                                gotSystemChart.systemOptions = {
                                    xAxis: { type: 'datetime' },
                                    title: { text: 'Influence trend' },
                                    series: series
                                };
                                this.systems.push(gotSystemChart);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
                });
        });
    }

    addSystems() {
        this.user.systems.forEach(system => {
            this.monitoredSystems.push(system.name);
        })
    }

    openFactionAddModal() {
        this.factionModal = true;
    }

    closeFactionAddModal() {
        this.factionModal = false;
    }

    openSystemAddModal() {
        this.systemModal = true;
    }

    closeSystemAddModal() {
        this.systemModal = false;
    }
}
