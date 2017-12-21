import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from 'clarity-angular';
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
        this.serverService
            .getUsers(this.route.snapshot.paramMap.get('userid'))
            .subscribe(user => {
                this.userData = user.docs[0];
            });
    }

    removeFaction(faction: string) {
        console.log(`Remove Faction ${faction}`);
    }

    addFaction() {
        console.log(`Add Faction ${this.factionAdd}`);
        this.factionAdd = '';
    }

    removeSystem(system: string) {
        console.log(`Remove Faction ${system}`);
    }

    addSystem() {
        console.log(`Add System ${this.systemAdd}`);
        this.systemAdd = '';
    }

    removeEditableFaction(faction: string) {
        console.log(`Remove Editable Faction ${faction}`);
    }

    addEditableFaction() {
        console.log(`Add Editable Faction ${this.editableFactionAdd}`);
        this.editableFactionAdd = '';
    }

    removeDonation(id: string) {
        console.log(`Remove Donation with id ${id}`);
    }

    addDonation() {
        console.log(`Donation of $${this.donationAmount} on ${this.donationDate} added`);
    }
}
