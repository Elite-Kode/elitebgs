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
    scripts: string[];
    successAlertState = false;
    failureAlertState = false;
    successAlertText: string;
    failureAlertText: string;
    constructor(
        private serverService: ServerService,
    ) {
        this.userCount = 0;
        this.latestUser = '';
        this.scripts = [];
        this.successAlertText = '';
        this.failureAlertText = '';
    }

    ngOnInit() {
        this.serverService
            .getScripts()
            .subscribe(scripts => {
                this.scripts = scripts;
            });
    }

    runScript(script) {
        this.serverService
            .putRunScript(script)
            .subscribe(status => {
                if (status === true) {
                    this.successAlertText = 'Script ran successfully';
                    this.successAlertState = true;
                    setTimeout(() => {
                        this.successAlertState = false;
                    }, 3000);
                } else {
                    this.failureAlertText = 'Some Error occurred while running script';
                    this.failureAlertState = true;
                    setTimeout(() => {
                        this.failureAlertState = false
                    }, 3000);
                }
            });
    }
}
