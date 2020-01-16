import { Component, HostBinding, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import cloneDeep from 'lodash-es/cloneDeep'
import { IActionMethodsSchema } from '../admin.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { SystemsService } from '../../services/systems.service';
import { IngameIdsService } from '../../services/ingameIds.service';
import { ThemeService } from '../../services/theme.service';
import { EBGSSystemSchemaWOHistory, IngameIdsSchema, EBGSSystemSchema } from '../../typings';
import * as moment from 'moment';

@Component({
    selector: 'app-admin-systems-view',
    templateUrl: './admin-systems-view.component.html'
})
export class AdminSystemsViewComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-container') contentContainer = true;
    @ViewChild(ClrDatagrid, {static: false}) datagrid: ClrDatagrid;
    systemData: EBGSSystemSchemaWOHistory;
    systemUnderEdit: EBGSSystemSchemaWOHistory;
    systemHistoryData: EBGSSystemSchema['history'];
    systemHistoryUnderEdit: EBGSSystemSchema['history'];
    successAlertState = false;
    failureAlertState = false;
    actionMethods: IActionMethodsSchema;
    warningTitle: string;
    warningText: string;
    warningProceed: string;
    warningModal: boolean;
    selectedActionMethod: string;
    FDevIDs: IngameIdsSchema;
    factionAdd = '';
    historyPageNumber = 1;
    historyTotalRecords = 0;
    historyLoading = true;
    historySelected = [];

    governments = [];
    allegiances = [];
    economies = [];
    states = [];
    securities = [];
    minorFactions = [];

    constructor(
        private systemsService: SystemsService,
        private authenticationService: AuthenticationService,
        private ingameIdsService: IngameIdsService,
        private themeService: ThemeService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.actionMethods = {
            save: () => {
                this.systemsService.putSystemAdmin(this.systemUnderEdit)
                    .subscribe(status => {
                        if (status === true) {
                            this.successAlertState = true;
                            setTimeout(() => {
                                this.successAlertState = false;
                            }, 3000);
                            this.getSystems();
                        } else {
                            this.failureAlertState = true;
                            setTimeout(() => {
                                this.failureAlertState = false
                            }, 3000);
                        }
                    });
            },
            reset: () => {
                this.systemUnderEdit = cloneDeep(this.systemData);
            },
            delete: () => {
                this.authenticationService
                    .removeUser(this.systemData._id)
                    .subscribe(status => {
                        this.router.navigateByUrl('/admin/system');
                    });
            }
        }
    }

    ngAfterViewInit() {
        this.themeService.theme$.subscribe(() => {
            this.datagrid.resize();
        });
    }

    async ngOnInit() {
        this.FDevIDs = await this.ingameIdsService.getAllIds().toPromise();
        this.populateSelects();
        this.getSystems();
        this.getSystemHistory();
    }

    refreshHistory(tableState: ClrDatagridStateInterface) {
        this.historyLoading = true;
        this.historyPageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        this.getSystemHistory();
    }

    populateSelects() {
        for (const key in this.FDevIDs.government) {
            if (this.FDevIDs.government.hasOwnProperty(key)) {
                this.governments.push({
                    key: key,
                    value: this.FDevIDs.government[key].name
                });
            }
        }
        for (const key in this.FDevIDs.superpower) {
            if (this.FDevIDs.superpower.hasOwnProperty(key)) {
                this.allegiances.push({
                    key: key,
                    value: this.FDevIDs.superpower[key].name
                });
            }
        }
        for (const key in this.FDevIDs.economy) {
            if (this.FDevIDs.economy.hasOwnProperty(key)) {
                this.economies.push({
                    key: key,
                    value: this.FDevIDs.economy[key].name
                });
            }
        }
        for (const key in this.FDevIDs.state) {
            if (this.FDevIDs.state.hasOwnProperty(key)) {
                this.states.push({
                    key: key,
                    value: this.FDevIDs.state[key].name
                });
            }
        }
        for (const key in this.FDevIDs.security) {
            if (this.FDevIDs.security.hasOwnProperty(key)) {
                this.securities.push({
                    key: key,
                    value: this.FDevIDs.security[key].name
                });
            }
        }
    }

    getSystems() {
        this.systemsService
            .getSystemsById(this.route.snapshot.paramMap.get('systemid'))
            .subscribe(systems => {
                this.systemData = systems.docs[0];
                this.systemUnderEdit = cloneDeep(this.systemData);

                for (const faction of this.systemUnderEdit.factions) {
                    this.minorFactions.push({
                        key: faction.name_lower,
                        value: faction.name
                    });
                }
            });
    }

    getSystemHistory() {
        this.systemsService
            .getHistoryAdmin(this.historyPageNumber.toString(), this.route.snapshot.paramMap.get('systemid'))
            .subscribe(history => {
                this.historyTotalRecords = history.total;
                this.historyLoading = false;
                this.systemHistoryData = history.docs;
            });
    }

    getUpdatedAtFormatted(updatedAt) {
        return {
            time: moment(updatedAt).utc().format('ddd, MMM D, HH:mm:ss'),
            fromNow: moment(updatedAt).fromNow(true),
            ageFlag: moment(Date.now()).diff(moment(updatedAt), 'days', true) - 1
        }
    }

    addFaction() {}

    save() {}

    reset() {}

    delete() {}

    closeWarningModal() {}

    warningConfirmed() {}

    addHistoryRecord() {}

    saveSelectedHistoryRecords() {}

    deleteSelectedHistoryRecords() {}

    // save() {
    //     this.selectedActionMethod = 'save';
    //     this.warningTitle = 'Confirm Save'
    //     this.warningText = `Would you like to save the changes?`;
    //     this.warningProceed = 'Save';
    //     this.warningModal = true;
    // }

    // reset() {
    //     this.selectedActionMethod = 'reset';
    //     this.warningTitle = 'Confirm Reset'
    //     this.warningText = `Would you like to reset all changes?`;
    //     this.warningProceed = 'Reset';
    //     this.warningModal = true;
    // }

    // delete() {
    //     this.selectedActionMethod = 'delete';
    //     this.warningTitle = 'Confirm Delete'
    //     this.warningText = `Would you like to delete the user?`;
    //     this.warningProceed = 'Delete';
    //     this.warningModal = true;
    // }

    // closeWarningModal() {
    //     this.warningModal = false;
    // }

    // warningConfirmed() {
    //     this.actionMethods[this.selectedActionMethod]();
    //     this.warningModal = false;
    //     this.warningText = null;
    //     this.warningTitle = null;
    //     this.warningProceed = null;
    //     this.selectedActionMethod = null;
    // }
}
