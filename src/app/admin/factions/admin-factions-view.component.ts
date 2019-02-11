import { Component, HostBinding, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import cloneDeep from 'lodash-es/cloneDeep'
import { IActionMethodsSchema } from '../admin.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { IngameIdsService } from '../../services/ingameIds.service';
import { ThemeService } from '../../services/theme.service';
import { IngameIdsSchema, EBGSFactionSchema, EBGSFactionSchemaWOHistory } from '../../typings';
import * as moment from 'moment';
import { FactionsService } from '../../services/factions.service';

@Component({
    selector: 'app-admin-factions-view',
    templateUrl: './admin-factions-view.component.html'
})
export class AdminFactionsViewComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-container') contentContainer = true;
    @ViewChild(ClrDatagrid) datagrid: ClrDatagrid;
    factionData: EBGSFactionSchemaWOHistory;
    factionUnderEdit: EBGSFactionSchemaWOHistory;
    factionHistoryData: EBGSFactionSchema['history'];
    factionHistoryUnderEdit: EBGSFactionSchema['history'];
    successAlertState = false;
    failureAlertState = false;
    actionMethods: IActionMethodsSchema;
    warningTitle: string;
    warningText: string;
    warningProceed: string;
    warningModal: boolean;
    selectedActionMethod: string;
    FDevIDs: IngameIdsSchema;
    systemAdd: EBGSFactionSchemaWOHistory['faction_presence'][0];
    historyPageNumber = 1;
    historyTotalRecords = 0;
    historyLoading = true;
    historySelected = [];

    governments = [];
    allegiances = [];
    happinesses = [];
    states = [];

    constructor(
        private factionsService: FactionsService,
        private authenticationService: AuthenticationService,
        private ingameIdsService: IngameIdsService,
        private themeService: ThemeService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.actionMethods = {
            save: () => {
                this.factionsService.putFactionAdmin(this.factionUnderEdit)
                    .subscribe(status => {
                        if (status === true) {
                            this.successAlertState = true;
                            setTimeout(() => {
                                this.successAlertState = false;
                            }, 3000);
                            this.getFactions();
                        } else {
                            this.failureAlertState = true;
                            setTimeout(() => {
                                this.failureAlertState = false
                            }, 3000);
                        }
                    });
            },
            reset: () => {
                this.factionUnderEdit = cloneDeep(this.factionData);
            },
            delete: () => {
                this.authenticationService
                    .removeUser(this.factionData._id)
                    .subscribe(status => {
                        this.router.navigateByUrl('/admin/faction');
                    });
            }
        }
        this.systemAdd = {
            system_name: '',
            system_name_lower: '',
            happiness: '',
            influence: 0,
            system_id: '',
            state: '',
            active_states: [],
            pending_states: [],
            recovering_states: [],
            updated_at: ''
        };
    }

    ngAfterViewInit() {
        this.themeService.theme$.subscribe(() => {
            this.datagrid.resize();
        });
    }

    async ngOnInit() {
        this.FDevIDs = await this.ingameIdsService.getAllIds().toPromise();
        this.populateSelects();
        this.getFactions();
        this.getFactionHistory();
    }

    refreshHistory(tableState: ClrDatagridStateInterface) {
        this.historyLoading = true;
        this.historyPageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        this.getFactionHistory();
    }

    populateSelects() {
        for (const key in this.FDevIDs.government) {
            if (this.FDevIDs.government.hasOwnProperty(key)) {
                this.governments.push({
                    key: this.FDevIDs.government[key].name.toLowerCase(),
                    value: this.FDevIDs.government[key].name
                });
            }
        }
        for (const key in this.FDevIDs.superpower) {
            if (this.FDevIDs.superpower.hasOwnProperty(key)) {
                this.allegiances.push({
                    key: this.FDevIDs.superpower[key].name.toLowerCase(),
                    value: this.FDevIDs.superpower[key].name
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
        for (const key in this.FDevIDs.happiness) {
            if (this.FDevIDs.happiness.hasOwnProperty(key)) {
                this.happinesses.push({
                    key: key,
                    value: this.FDevIDs.happiness[key].name
                });
            }
        }
    }

    getFactions() {
        this.factionsService
            .getFactionsById(this.route.snapshot.paramMap.get('factionid'))
            .subscribe(factions => {
                this.factionData = factions.docs[0];
                this.factionUnderEdit = cloneDeep(this.factionData);
            });
    }

    getFactionHistory() {
        this.factionsService
            .getHistoryAdmin(this.historyPageNumber.toString(), this.route.snapshot.paramMap.get('factionid'))
            .subscribe(history => {
                this.historyTotalRecords = history.total;
                this.historyLoading = false;
                this.factionHistoryData = history.docs;
            });
    }

    getUpdatedAtFormatted(updatedAt) {
        return {
            time: moment(updatedAt).utc().format('ddd, MMM D, HH:mm:ss'),
            fromNow: moment(updatedAt).fromNow(true),
            ageFlag: moment(Date.now()).diff(moment(updatedAt), 'days', true) - 1
        }
    }

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
