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
    userData: EBGSUser;
    constructor(
        private serverService: ServerService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.serverService
            .getUsers(this.route.snapshot.paramMap.get('userid'))
            .subscribe(user => {
                this.userData = user.docs[0];
            });
    }
}
