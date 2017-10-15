import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SystemsService } from '../../services/systems.service';
import { AuthenticationService } from '../../services/authentication.service';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSSystemChart } from '../../typings';

@Component({
    selector: 'app-system-view',
    templateUrl: './system-view.component.html'
})
export class SystemViewComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    systemData: EBGSSystemChart;
    editAllowed: boolean;
    editModal: boolean;
    constructor(
        private systemService: SystemsService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        this.systemService
            .parseSystemDataId([this.route.snapshot.paramMap.get('systemid')])
            .then(system => {
                this.systemData = system[0];
                this.systemData.government = FDevIDs.government[this.systemData.government].name;
                this.systemData.allegiance = FDevIDs.superpower[this.systemData.allegiance].name;
                this.systemData.primary_economy = FDevIDs.economy[this.systemData.primary_economy].name;
                this.systemData.state = FDevIDs.state[this.systemData.state].name;
                this.systemData.security = FDevIDs.security[this.systemData.security].name;
                this.systemData.factions.forEach(faction => {
                    faction.state = FDevIDs.state[faction.state].name;
                    faction.pending_states.forEach(state => {
                        state.state = FDevIDs.state[state.state].name;
                    });
                    faction.recovering_states.forEach(state => {
                        state.state = FDevIDs.state[state.state].name;
                    });
                });
                this.getEditAllowed();
            });
    }

    openSystemEditModal() {
        this.editModal = true;
    }

    getEditAllowed() {
        this.authenticationService
            .isEditAllowed(this.systemData.name_lower)
            .subscribe(check => {
                this.editAllowed = check;
            })
    }
}
