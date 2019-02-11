import { Component, HostBinding, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import cloneDeep from 'lodash-es/cloneDeep'
import { StationsService } from '../../services/stations.service';
import { IActionMethodsSchema } from '../admin.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { IngameIdsService } from '../../services/ingameIds.service';
import { ThemeService } from '../../services/theme.service';
import { IngameIdsSchema, EBGSStationSchema, EBGSStationSchemaWOHistory } from '../../typings';
import * as moment from 'moment';

@Component({
    selector: 'app-admin-station-view',
    templateUrl: './admin-station-view.component.html'
})
export class AdminStationViewComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-container') contentContainer = true;
    @ViewChild(ClrDatagrid) datagrid: ClrDatagrid;
    stationData: EBGSStationSchemaWOHistory;
    stationUnderEdit: EBGSStationSchemaWOHistory;
    stationHistoryData: EBGSStationSchema['history'];
    stationHistoryUnderEdit: EBGSStationSchema['history'];
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
        private stationsService: StationsService,
        private authenticationService: AuthenticationService,
        private ingameIdsService: IngameIdsService,
        private themeService: ThemeService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.actionMethods = {
            save: () => {
                this.stationsService.putStationAdmin(this.stationUnderEdit)
                    .subscribe(status => {
                        if (status === true) {
                            this.successAlertState = true;
                            setTimeout(() => {
                                this.successAlertState = false;
                            }, 3000);
                            this.getStations();
                        } else {
                            this.failureAlertState = true;
                            setTimeout(() => {
                                this.failureAlertState = false
                            }, 3000);
                        }
                    });
            },
            reset: () => {
                this.stationUnderEdit = cloneDeep(this.stationData);
            },
            delete: () => {
                this.authenticationService
                    .removeUser(this.stationData._id)
                    .subscribe(status => {
                        this.router.navigateByUrl('/admin/station');
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
        this.getStations();
        this.getStationHistory();
    }

    refreshHistory(tableState: ClrDatagridStateInterface) {
        this.historyLoading = true;
        this.historyPageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        this.getStationHistory();
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

    getStations() {
        this.stationsService
            .getStationsById(this.route.snapshot.paramMap.get('stationid'))
            .subscribe(stations => {
                this.stationData = stations.docs[0];
                this.stationUnderEdit = cloneDeep(this.stationData);

                // for (const faction of this.stationUnderEdit.factions) {
                //     this.minorFactions.push({
                //         key: faction.name_lower,
                //         value: faction.name
                //     });
                // }
            });
    }

    getStationHistory() {
        this.stationsService
            .getHistoryAdmin(this.historyPageNumber.toString(), this.route.snapshot.paramMap.get('stationid'))
            .subscribe(history => {
                this.historyTotalRecords = history.total;
                this.historyLoading = false;
                this.stationHistoryData = history.docs;
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
