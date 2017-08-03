import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { State } from 'clarity-angular';
import { FactionsService } from './services/factions.service';
import { IFaction } from './faction.interface';
import { StringHandlers } from './utilities/stringHandlers';

@Component({
    selector: 'app-faction-list',
    templateUrl: './faction-list.component.html',
})
export class FactionListComponent implements OnInit {
    private factionData: IFaction[] = [];
    private loading = true;
    private totalRecords = 0;
    private pageNumber = 1;
    private tableState: State;
    private factionForm = new FormGroup({
        factionName: new FormControl()
    });
    constructor(
        private factionService: FactionsService,
        private router: Router
    ) { }

    showFaction(factions) {
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

    onView(faction: IFaction) {
        this.router.navigate(['/faction', faction.id]);
    }

    ngOnInit() {
        this.factionForm.valueChanges.subscribe(value => {
            this.refresh(this.tableState, value.factionName);
        })
    }
}
