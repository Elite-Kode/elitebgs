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

type EBGSSystemFaction = EBGSSystemV3Schema['factions'];

interface EBGSSystemFactionChart extends EBGSSystemFaction {
    influence: number;
    state: string;
    pending_states: [{
        state: string;
        trend: number;
    }];
    recovering_states: [{
        state: string;
        trend: number;
    }];
}

interface EBGSSystemChart extends EBGSSystemV3Schema {
    systemOptions: Options;
    factions: [{
        name: string;
        name_lower: string;
        influence: number;
        state: string;
        pending_states: [{
            state: string;
            trend: number;
        }];
        recovering_states: [{
            state: string;
            trend: number;
        }];
    }]
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
    constructor(
        private authenticationService: AuthenticationService,
        private factionsService: FactionsService,
        private systemsService: SystemsService
    ) { }

    ngOnInit(): void {
        this.getAuthentication();
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
                            const allSystems = [];
                            history.forEach(element => {
                                if (allSystems.indexOf(element.system) === -1) {
                                    allSystems.push(element.system);
                                }
                            });
                            const series = [];
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
                                const data = [];
                                history.forEach(element => {
                                    if (element.system === system) {
                                        data.push([
                                            Date.parse(element.updated_at),
                                            Number.parseFloat((element.influence * 100).toFixed(2))
                                        ])
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
                    })
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
                        })
                    })
                });
                this.getSystems();
            })
            .catch(err => {
                console.log(err);
            })
    }

    getSystems() {
        this.monitoredSystems.forEach(system => {
            this.systemsService
                .getHistory(system, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString())
                .subscribe(systems => {
                    systems.docs.forEach(gotSystem => {
                        const gotSystemChart: EBGSSystemChart = gotSystem as EBGSSystemChart;
                        gotSystemChart.factions.forEach((faction, index, array) => {
                            this.factionsService
                                .getFactions('1', faction.name_lower)
                                .subscribe(factions => {
                                    const indexOfSystem = factions.docs[0].faction_presence.findIndex(presenceElement => {
                                        return presenceElement.system_name_lower === gotSystem.name_lower;
                                    })
                                    array[index].influence = factions.docs[0].faction_presence[indexOfSystem].influence;
                                    array[index].state = factions.docs[0].faction_presence[indexOfSystem].state;
                                    array[index].pending_states = factions.docs[0].faction_presence[indexOfSystem].pending_states;
                                    array[index].recovering_states = factions.docs[0].faction_presence[indexOfSystem].recovering_states;
                                })
                        })
                        this.systems.push(gotSystemChart);
                    })
                })
        })
    }

    addSystems() {
        this.user.systems.forEach(system => {
            this.monitoredSystems.push(system.name);
        })
    }
}
