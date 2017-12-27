import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    successAlertState = false;
    failureAlertState = false;
    user: EBGSUser;
    timelineData = {
        chartType: 'Timeline',
        dataTable: [
            ['Name', 'From', 'To'],
            ['Washington', new Date(1789, 3, 30), new Date(1797, 2, 4)],
            ['Adams', new Date(1797, 2, 4), new Date(1801, 2, 4)],
            ['Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4)]
        ],
        options: { 'title': 'States' },
    };
    constructor(
        private factionService: FactionsService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService
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
