import { Component, OnInit, HostBinding } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Title } from '@angular/platform-browser';
import { FactionsService } from '../../services/factions.service';
import { AuthenticationService } from '../../services/authentication.service';
import { IFaction } from './faction.interface';
import { StringHandlers } from '../../utilities/stringHandlers';
import { EBGSFactionsV3WOHistory } from '../../typings';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-faction-list',
    templateUrl: './faction-list.component.html',
})
export class FactionListComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    factionData: IFaction[] = [];
    loading = true;
    factionToAdd: string;
    totalRecords = 0;
    private pageNumber = 1;
    private tableState: ClrDatagridStateInterface;
    factionForm = new FormGroup({
        factionName: new FormControl()
    });
    constructor(
        private factionService: FactionsService,
        private titleService: Title
    ) {
        this.titleService.setTitle('Faction Search - Elite BGS');
    }

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

    refresh(tableState: ClrDatagridStateInterface) {
        let beginsWith = this.factionForm.value.factionName;
        this.tableState = tableState;
        this.loading = true;
        this.pageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        if (!beginsWith) {
            beginsWith = '';
        }

        this.factionService
            .getFactionsBegins(this.pageNumber.toString(), beginsWith)
            .subscribe(factions => this.showFaction(factions));
        this.loading = false;
    }

    ngOnInit() {
        this.factionForm.valueChanges
            .pipe(debounceTime(300))
            .pipe(switchMap(value => {
                this.loading = true;
                this.pageNumber = Math.ceil((this.tableState.page.to + 1) / this.tableState.page.size);
                if (!value.factionName) {
                    value.factionName = '';
                }
                return this.factionService
                    .getFactionsBegins(this.pageNumber.toString(), value.factionName)
            }))
            .subscribe(factions => {
                this.showFaction(factions);
                this.loading = false;
            });
    }
}
