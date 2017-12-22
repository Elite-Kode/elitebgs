import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from 'clarity-angular';
import cloneDeep from 'lodash-es/cloneDeep'
import { IAdminUsers } from './admin-users.interface';
import { ServerService } from '../../services/server.service';
import { EBGSUser } from '../../typings';

@Component({
    selector: 'app-admin-users',
    templateUrl: './admin-users-view.component.html',
    styleUrls: ['./admin-users-view.component.scss']
})
export class AdminUsersViewComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    factionAdd: string;
    systemAdd: string;
    editableFactionAdd: string;
    donationAmount: number;
    donationDate: string;
    userData: EBGSUser;
    userUnderEdit: EBGSUser;
    successAlertState = false;
    failureAlertState = false;
    constructor(
        private serverService: ServerService,
        private route: ActivatedRoute
    ) {
        this.factionAdd = '';
        this.systemAdd = '';
        this.editableFactionAdd = '';
        this.donationAmount = 0;
        this.donationDate = '';
    }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.serverService
            .getUsers(this.route.snapshot.paramMap.get('userid'))
            .subscribe(user => {
                this.userData = user.docs[0];
                this.userUnderEdit = cloneDeep(this.userData);
            });
    }

    removeFaction(faction: string) {
        this.userUnderEdit.factions.splice(this.userUnderEdit.factions.findIndex(element => {
            return element.name_lower === faction.toLowerCase();
        }));
    }

    addFaction() {
        this.userUnderEdit.factions.push({
            name: this.factionAdd,
            name_lower: this.factionAdd.toLowerCase()
        });
        this.factionAdd = '';
    }

    removeSystem(system: string) {
        this.userUnderEdit.systems.splice(this.userUnderEdit.systems.findIndex(element => {
            return element.name_lower === system.toLowerCase();
        }));
    }

    addSystem() {
        this.userUnderEdit.systems.push({
            name: this.systemAdd,
            name_lower: this.systemAdd.toLowerCase()
        });
        this.systemAdd = '';
    }

    removeEditableFaction(faction: string) {
        this.userUnderEdit.editable_factions.splice(this.userUnderEdit.editable_factions.findIndex(element => {
            return element.name_lower === faction.toLowerCase();
        }));
    }

    addEditableFaction() {
        this.userUnderEdit.editable_factions.push({
            name: this.editableFactionAdd,
            name_lower: this.editableFactionAdd.toLowerCase()
        });
        this.editableFactionAdd = '';
    }

    removeDonation(id: string) {
        this.userUnderEdit.donation.splice(this.userUnderEdit.donation.findIndex(element => {
            return element._id === id.toLowerCase();
        }));
    }

    addDonation() {
        this.userUnderEdit.donation.push({
            _id: `(${this.userUnderEdit.donation.length + 1}) Save to Generate Actual Id`,
            amount: this.donationAmount,
            date: this.donationDate
        });
        this.donationAmount = 0;
        this.donationDate = '';
    }

    save() {
        console.log(`Saving Data`);
        this.userUnderEdit.donation.forEach(element => {
            if (element._id && element._id.search(new RegExp(`^\(\d\)\sSave\sto\sGenerate\sActual\sId$`, 'g'))) {
                delete element._id;
            }
        });
        this.serverService.putUser(this.userUnderEdit)
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
    }

    reset() {
        this.userUnderEdit = cloneDeep(this.userData);
    }
}
