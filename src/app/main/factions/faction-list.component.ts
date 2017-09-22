import { Component, OnInit, HostBinding } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { State } from 'clarity-angular';
import { FactionsService } from '../../services/factions.service';
import { AuthenticationService } from '../../services/authentication.service';
import { IFaction } from './faction.interface';
import { StringHandlers } from '../../utilities/stringHandlers';
import { EBGSFactionsV3WOHistory } from '../../typings';

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
    confirmModal: boolean;
    successAlertState = false;
    failureAlertState = false;
    private pageNumber = 1;
    private tableState: State;
    factionForm = new FormGroup({
        factionName: new FormControl()
    });
    constructor(
        private factionService: FactionsService,
        private authenticationService: AuthenticationService
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
            .getFactionsBegins(this.pageNumber.toString(), beginsWith)
            .subscribe(factions => this.showFaction(factions));
        this.loading = false;
    }

    addFaction(name: string) {
        this.factionToAdd = name;
        this.openConfirmModal();
    }

    confirmAddFaction() {
        this.authenticationService
            .addFactions([this.factionToAdd])
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
        this.closeConfirmModal();
    }

    openConfirmModal() {
        this.confirmModal = true;
    }

    closeConfirmModal() {
        this.confirmModal = false;
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => {
                this.isAuthenticated = status;
            });
    }

    ngOnInit() {
        this.getAuthentication();
        this.factionForm.valueChanges.subscribe(value => {
            this.refresh(this.tableState, value.factionName);
        })
    }
}
