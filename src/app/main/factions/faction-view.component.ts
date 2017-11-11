import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FactionsService } from '../../services/factions.service';
import { StringHandlers } from '../../utilities/stringHandlers';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSFactionV3Schema } from '../../typings';

@Component({
    selector: 'app-faction-view',
    templateUrl: './faction-view.component.html'
})
export class FactionViewComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    factionData: EBGSFactionV3Schema;
    constructor(
        private factionService: FactionsService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
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
}
