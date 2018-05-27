import { Component, HostBinding, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from '@clr/angular';
import cloneDeep from 'lodash-es/cloneDeep'
import { IActionMethodsSchema } from './profile-report-users.interface';
import { ServerService } from '../services/server.service';
import { AuthenticationService } from '../services/authentication.service';
import { EBGSUser } from '../typings';

@Component({
    selector: 'app-profile-report',
    templateUrl: './profile-report.component.html',
    styleUrls: ['./profile-report.component.scss']
})
export class ProfileReportComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    userData: EBGSUser;
    userUnderEdit: EBGSUser;
    successAlertState = false;
    failureAlertState = false;
    actionMethods: IActionMethodsSchema;
    warningTitle: string;
    warningText: string;
    warningProceed: string;
    warningModal: boolean;
    selectedActionMethod: string;
    constructor(
        private authenticationService: AuthenticationService
    ) {
        this.actionMethods = {
            save: () => {
                console.log(`Saving Data`);
                this.authenticationService.putUser(this.userUnderEdit)
                    .subscribe(status => {
                        if (status === true) {
                            this.successAlertState = true;
                            setTimeout(() => {
                                this.successAlertState = false;
                            }, 3000);
                            this.getUsers();
                        } else {
                            this.failureAlertState = true;
                            setTimeout(() => {
                                this.failureAlertState = false
                            }, 3000);
                        }
                    });
            },
            reset: () => {
                this.userUnderEdit = cloneDeep(this.userData);
            }
        }
    }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.authenticationService
            .getUser()
            .subscribe(user => {
                this.userData = user;
                this.userUnderEdit = cloneDeep(this.userData);
            });
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

    deleteAvatar() {
        this.userUnderEdit.avatar = null;
    }

    deleteEmail() {
        this.userUnderEdit.email = null;
    }

    deleteGuilds() {
        this.userUnderEdit.guilds = [];
    }

    deleteContribution() {
        this.userUnderEdit.os_contribution = null;
    }

    deletePatronage() {
        this.userUnderEdit.patronage = null;
    }

    deleteDonations() {
        this.userUnderEdit.donation = null;
    }
}
