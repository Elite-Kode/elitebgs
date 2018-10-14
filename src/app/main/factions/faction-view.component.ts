import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FactionsService } from '../../services/factions.service';
import { AuthenticationService } from '../../services/authentication.service';
import { StringHandlers } from '../../utilities/stringHandlers';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSFactionV3Schema, EBGSUser } from '../../typings';

@Component({
    selector: 'app-faction-view',
    templateUrl: './faction-view.component.html'
})
export class FactionViewComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    factionData: EBGSFactionV3Schema;
    systemsPresence: number;
    systemsControlled: number;
    successAlertState = false;
    failureAlertState = false;
    user: EBGSUser;
    constructor(
        private factionService: FactionsService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private titleService: Title
    ) { }

    ngOnInit() {
        this.getAuthentication();
        this.factionService
            .parseFactionDataId([this.route.snapshot.paramMap.get('factionid')])
            .then(faction => {
                this.factionData = faction[0];
                this.factionData.government = StringHandlers.titlify(this.factionData.government);
                this.factionData.allegiance = StringHandlers.titlify(this.factionData.allegiance);
                this.factionData.faction_presence.forEach(system => {
                    system.state = FDevIDs.state[system.state].name;
                    system.pending_states.forEach(state => {
                        state.state = FDevIDs.state[state.state].name;
                    });
                    system.recovering_states.forEach(state => {
                        state.state = FDevIDs.state[state.state].name;
                    });
                });
                this.systemsPresence = this.factionData.faction_presence.length;
                this.systemsControlled = this.factionData.faction_presence.reduce((count, system) => {
                    if (system.controlling) {
                        return count + 1;
                    } else {
                        return count;
                    }
                }, 0);
                this.titleService.setTitle(this.factionData.name + ' - Elite BGS');
            })
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
                }
            });
    }

    monitor() {
        this.authenticationService
            .addFactions([this.factionData.name])
            .subscribe(status => {
                if (status === true) {
                    this.successAlertState = true;
                    setTimeout(() => {
                        this.successAlertState = false;
                    }, 3000);
                } else {
                    this.failureAlertState = true;
                    setTimeout(() => {
                        this.failureAlertState = false
                    }, 3000);
                }
            });
    }

    getUser() {
        this.authenticationService
            .getUser()
            .subscribe(user => {
                this.user = user;
            });
    }
}
