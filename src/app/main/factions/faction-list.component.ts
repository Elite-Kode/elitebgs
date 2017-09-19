import { Component, OnInit, HostBinding } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { State } from 'clarity-angular';
import { FactionsService } from '../../services/factions.service';
import { IFaction } from './faction.interface';
import { StringHandlers } from '../../utilities/stringHandlers';
import { EBGSFactionsV3WOHistory } from '../../typings';

@Component({
    selector: 'app-faction-list',
    templateUrl: './faction-list.component.html',
})
export class FactionListComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    factionData: IFaction[] = [];
    loading = true;
    totalRecords = 0;
    private pageNumber = 1;
    private tableState: State;
    factionForm = new FormGroup({
        factionName: new FormControl()
    });
    constructor(
        private factionService: FactionsService
    ) { }

    showFaction(factions: EBGSFactionsV3WOHistory) {
        this.totalRecords = factions.total;
        this.factionData = factions.docs.map(responseFaction => {
            const id = responseFaction._id;
            const name = responseFaction.name;
            const government = StringHandlers.titlify(responseFaction.government);
            const allegiance = StringHandlers.titlify(responseFaction.allegiance);
            return <IFaction>{
                id: id,
                name: name,
                government: government,
                allegiance: allegiance
            };
        });
    }

    refresh(tableState: State, beginsWith = this.factionForm.value.factionName) {
        this.tableState = tableState;
        this.loading = true;
        this.pageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        if (!beginsWith) {
            beginsWith = '';
        }

        this.factionService
            .getFactions(this.pageNumber.toString(), beginsWith)
            .subscribe(factions => this.showFaction(factions));
        this.loading = false;
    }

    ngOnInit() {
        this.factionForm.valueChanges.subscribe(value => {
            this.refresh(this.tableState, value.factionName);
        })
    }
}
