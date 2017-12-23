import { Component, HostBinding, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { EBGSUser } from '../../typings';

@Component({
    selector: 'app-admin-overview',
    templateUrl: './admin-overview.component.html'
})
export class AdminOverviewComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    userCount: number;
    latestUser: string;
    userEditFaction: EBGSUser
    constructor(
        private serverService: ServerService,
    ) {
        this.userCount = 0;
        this.latestUser = '';
    }

    ngOnInit() {

    }
}
