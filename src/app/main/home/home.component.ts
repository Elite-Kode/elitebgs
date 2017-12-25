import { Component, OnInit, HostBinding } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import { FactionsService } from '../../services/factions.service';
import { SystemsService } from '../../services/systems.service';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSUser, EBGSFactionV3Schema, EBGSSystemChart } from '../../typings';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    user: EBGSUser;
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
        const factionList = this.user.factions.map(faction => {
            return faction.name;
        });

        this.factionsService
            .parseFactionDataName(factionList)
            .then(factionData => {
                this.factions = factionData;
                factionData.forEach(factionDoc => {
                    factionDoc.faction_presence.forEach(system => {
                        if (this.monitoredSystems.indexOf(system.system_name) === -1) {
                            this.monitoredSystems.push(system.system_name);
                        }
                    });
                });
                this.factions.forEach(faction => {
                    faction.faction_presence.forEach(system => {
                        system.state = FDevIDs.state[system.state].name;
                        system.pending_states.forEach(state => {
                            state.state = FDevIDs.state[state.state].name;
                        });
                        system.recovering_states.forEach(state => {
                            state.state = FDevIDs.state[state.state].name;
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
        this.systemsService
            .parseSystemDataName(this.monitoredSystems)
            .then(systemData => {
                this.systems = systemData;
                this.systems.forEach(system => {
                    system.state = FDevIDs.state[system.state].name;
                    system.factions.forEach(faction => {
                        faction.state = FDevIDs.state[faction.state].name;
                        faction.pending_states.forEach(state => {
                            state.state = FDevIDs.state[state.state].name;
                        });
                        faction.recovering_states.forEach(state => {
                            state.state = FDevIDs.state[state.state].name;
                        });
                    });
                });
            })
            .catch(err => {
                console.log(err);
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
