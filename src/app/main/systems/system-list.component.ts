import { Component, OnInit, HostBinding } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { State } from 'clarity-angular';
import { SystemsService } from '../../services/systems.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ISystem } from './system.interface';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSSystemsV3WOHistory } from '../../typings';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-system-list',
    templateUrl: './system-list.component.html',
})
export class SystemListComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    systemData: ISystem[] = [];
    loading = true;
    systemToAdd: string;
    totalRecords = 0;
    confirmModal: boolean;
    successAlertState = false;
    failureAlertState = false;
    private pageNumber = 1;
    private tableState: State;
    systemForm = new FormGroup({
        systemName: new FormControl()
    });
    constructor(
        private systemService: SystemsService,
        private authenticationService: AuthenticationService
    ) { }

    showSystem(systems: EBGSSystemsV3WOHistory) {
        this.totalRecords = systems.total;
        this.systemData = systems.docs.map(responseSystem => {
            const id = responseSystem._id;
            const name = responseSystem.name;
            const government = FDevIDs.government[responseSystem.government].name;
            const allegiance = FDevIDs.superpower[responseSystem.allegiance].name;
            const primary_economy = FDevIDs.economy[responseSystem.primary_economy].name;
            const state = FDevIDs.state[responseSystem.state].name;
            return <ISystem>{
                id: id,
                name: name,
                government: government,
                allegiance: allegiance,
                primary_economy: primary_economy,
                state: state
            };
        });
    }

    refresh(tableState: State) {
        let beginsWith = this.systemForm.value.systemName;
        this.tableState = tableState;
        this.loading = true;
        this.pageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        if (!beginsWith) {
            beginsWith = '';
        }

        this.systemService
            .getSystemsBegins(this.pageNumber.toString(), beginsWith)
            .subscribe(systems => this.showSystem(systems));
        this.loading = false;
    }

    addSystem(name: string) {
        this.systemToAdd = name;
        this.openConfirmModal();
    }

    confirmAddSystem() {
        this.authenticationService
            .addSystems([this.systemToAdd])
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
        this.systemForm.valueChanges
            .debounceTime(300)
            .switchMap(value => {
                this.loading = true;
                this.pageNumber = Math.ceil((this.tableState.page.to + 1) / this.tableState.page.size);
                if (!value.systemName) {
                    value.systemName = '';
                }
                return this.systemService
                    .getSystemsBegins(this.pageNumber.toString(), value.systemName)
            })
            .subscribe(systems => {
                this.showSystem(systems);
                this.loading = false;
            });
    }
}
