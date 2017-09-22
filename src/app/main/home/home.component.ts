import { Component, OnInit, HostBinding } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import { FactionsService } from '../../services/factions.service';
import { SystemsService } from '../../services/systems.service';
import { EBGSFactionsV3, EBGSUser, EBGSFactionV3Schema, EBGSSystemV3Schema } from '../../typings';
import { Options, IndividualSeriesOptions } from 'highcharts';

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

interface EBGSSystemChart extends EBGSSystemV3Schema {
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
    // factions: EBGSFactionChart[] = [];
    factions: EBGSFactionV3Schema[] = [];
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
                            this.factions.push(gotFaction);
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
                        const gotSystemChart: EBGSSystemChart = gotSystem as EBGSSystemChart;
                        const allFactionsGet: Promise<EBGSFactionV3Schema>[] = [];
                        gotSystem.factions.forEach(faction => {
                            allFactionsGet.push(new Promise((resolve, reject) => {
                                this.factionsService
                                    .getFactions(faction.name)
                                    .subscribe(factions => {
                                        const indexOfFactionInSystem = gotSystemChart.factions.findIndex(factionElement => {
                                            return factionElement.name_lower === faction.name_lower;
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
                                        resolve();
                                    },
                                    (err: HttpErrorResponse) => {
                                        reject(err);
                                    });
                            }));
                        });
                        Promise.all(allFactionsGet)
                            .then(() => {
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
