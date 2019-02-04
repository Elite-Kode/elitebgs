import { Component, HostBinding, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import cloneDeep from 'lodash-es/cloneDeep'
import { IActionMethodsSchema } from '../admin.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { EBGSSystemSchemaWOHistory, IngameIdsSchema } from '../../typings';
import { SystemsService } from '../../services/systems.service';
import * as moment from 'moment';
import { IngameIdsService } from '../../services/ingameIds.service';

@Component({
    selector: 'app-admin-systems-view',
    templateUrl: './admin-systems-view.component.html',
    styleUrls: ['./admin-systems-view.component.scss']
})
export class AdminSystemsViewComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    systemData: EBGSSystemSchemaWOHistory;
    systemUnderEdit: EBGSSystemSchemaWOHistory;
    successAlertState = false;
    failureAlertState = false;
    actionMethods: IActionMethodsSchema;
    warningTitle: string;
    warningText: string;
    warningProceed: string;
    warningModal: boolean;
    selectedActionMethod: string;
    FDevIDs: IngameIdsSchema;

    government: string;
    allegiance: string;
    primary_economy: string;
    secondary_economy: string;
    state: string;
    security: string;

    governments = [];
    allegiances = null;
    economies = null;
    states = null;
    securities = null;
    minorFactions = null;

    constructor(
        private systemsService: SystemsService,
        private authenticationService: AuthenticationService,
        private ingameIdsService: IngameIdsService,
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

    async ngOnInit() {
        this.FDevIDs = await this.ingameIdsService.getAllIds().toPromise();
        for (const key in this.FDevIDs.government) {
            if (this.FDevIDs.government.hasOwnProperty(key)) {
                this.governments.push({
                    key: key,
                    value: this.FDevIDs.government[key].name
                });
            }
        }
        this.getSystems();
    }

    getSystems() {
        this.systemsService
            .getSystemsById(this.route.snapshot.paramMap.get('userid'))
            .subscribe(systems => {
                this.systemData = systems.docs[0];
                this.government = this.FDevIDs.government[this.systemData.government].name;
                this.allegiance = this.FDevIDs.superpower[this.systemData.allegiance].name;
                this.primary_economy = this.FDevIDs.economy[this.systemData.primary_economy].name;
                this.secondary_economy = this.systemData.secondary_economy ? this.FDevIDs.economy[this.systemData.secondary_economy].name : this.systemData.secondary_economy;
                this.state = this.FDevIDs.state[this.systemData.state].name;
                this.security = this.FDevIDs.security[this.systemData.security].name;
                this.systemUnderEdit = cloneDeep(this.systemData);
            });
    }

    getUpdatedAtFormatted(updatedAt) {
        return {
            time: moment(updatedAt).utc().format('ddd, MMM D, HH:mm:ss'),
            fromNow: moment(updatedAt).fromNow(true),
            ageFlag: moment(Date.now()).diff(moment(updatedAt), 'days', true) - 1
        }
    }

    save() {
        this.selectedActionMethod = 'save';
        this.warningTitle = 'Confirm Save'
        this.warningText = `Would you like to save the changes?`;
        this.warningProceed = 'Save';
        this.warningModal = true;
    }

    reset() {
        this.selectedActionMethod = 'reset';
        this.warningTitle = 'Confirm Reset'
        this.warningText = `Would you like to reset all changes?`;
        this.warningProceed = 'Reset';
        this.warningModal = true;
    }

    delete() {
        this.selectedActionMethod = 'delete';
        this.warningTitle = 'Confirm Delete'
        this.warningText = `Would you like to delete the user?`;
        this.warningProceed = 'Delete';
        this.warningModal = true;
    }

    closeWarningModal() {
        this.warningModal = false;
    }

    warningConfirmed() {
        this.actionMethods[this.selectedActionMethod]();
        this.warningModal = false;
        this.warningText = null;
        this.warningTitle = null;
        this.warningProceed = null;
        this.selectedActionMethod = null;
    }
}
