import { Component, HostBinding, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import cloneDeep from 'lodash-es/cloneDeep'
import { IActionMethodsSchema } from '../admin.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { EBGSUser } from '../../typings';
import { UsersService } from 'app/services/users.service';

@Component({
    selector: 'app-admin-users-view',
    templateUrl: './admin-users-view.component.html',
    styleUrls: ['./admin-users-view.component.scss']
})
export class AdminUsersViewComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    factionAdd: string;
    systemAdd: string;
    donationAmount: number;
    donationDate: Date;
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
        private usersService: UsersService,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.factionAdd = '';
        this.systemAdd = '';
        this.donationAmount = 0;
        this.actionMethods = {
            save: () => {
                if (this.userUnderEdit.donation) {
                    this.userUnderEdit.donation.forEach(element => {
                        if (element._id && element._id.search(/^\(\d\) Save to Generate Actual Id$/) !== -1) {
                            delete element._id;
                        }
                    });
                }
                this.usersService.putUser(this.userUnderEdit)
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
            },
            delete: () => {
                this.authenticationService
                    .removeUser(this.userData._id)
                    .subscribe(status => {
                        this.router.navigateByUrl('/admin/user');
                    });
            }
        }
    }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.usersService
            .getUser(this.route.snapshot.paramMap.get('userid'))
            .subscribe(user => {
                this.userData = user.docs[0];
                this.userUnderEdit = cloneDeep(this.userData);
            });
    }

    removeFaction(faction: string) {
        this.userUnderEdit.factions.splice(this.userUnderEdit.factions.findIndex(element => {
            return element.name_lower === faction.toLowerCase();
        }), 1);
    }

    addFaction() {
        if (!this.userUnderEdit.factions) {
            this.userUnderEdit.factions = [];
        }
        this.userUnderEdit.factions.push({
            name: this.factionAdd,
            name_lower: this.factionAdd.toLowerCase()
        });
        this.factionAdd = '';
    }

    removeSystem(system: string) {
        this.userUnderEdit.systems.splice(this.userUnderEdit.systems.findIndex(element => {
            return element.name_lower === system.toLowerCase();
        }), 1);
    }

    addSystem() {
        if (!this.userUnderEdit.systems) {
            this.userUnderEdit.systems = [];
        }
        this.userUnderEdit.systems.push({
            name: this.systemAdd,
            name_lower: this.systemAdd.toLowerCase()
        });
        this.systemAdd = '';
    }

    removeDonation(id: string) {
        this.userUnderEdit.donation.splice(this.userUnderEdit.donation.findIndex(element => {
            return element._id === id.toLowerCase();
        }), 1);
    }

    addDonation() {
        if (!this.userUnderEdit.donation) {
            this.userUnderEdit.donation = []
        }
        this.userUnderEdit.donation.push({
            _id: `(${this.userUnderEdit.donation.length + 1}) Save to Generate Actual Id`,
            amount: this.donationAmount,
            date: this.donationDate
        });
        this.donationAmount = 0;
        this.donationDate = undefined;
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
