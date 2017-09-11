import { Component, OnInit, HostBinding } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FactionsService } from '../../services/factions.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    user: any;
    factions = [];
    constructor(
        private authenticationService: AuthenticationService,
        private factionsService: FactionsService
    ) { }

    ngOnInit(): void {
        this.getAuthentication();
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => {
                this.isAuthenticated = status;
                if (this.isAuthenticated) {
                    this.getUser();
                } else {
                    this.user = {};
                    this.factions = [];
                }
            });
    }

    getUser() {
        this.authenticationService
            .getUser()
            .subscribe(user => {
                this.user = user;
                this.getFactions();
            });
    }

    getFactions() {
        if (this.user.factions) {
            this.user.factions.forEach(faction => {
                this.factionsService
                    .getFactions('1', faction.name)
                    .subscribe(factions => {
                        factions.docs.forEach(gotFaction => {
                            this.factions.push(gotFaction);
                        });
                    })
            });
        }
    }
}
