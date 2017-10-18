import { Component, OnInit, HostBinding } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { EBGSUser } from 'app/typings';

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    @HostBinding('style.flex-direction') flexDirection = 'column';
    isAuthenticated: boolean;
    inviteCode: String;
    user: EBGSUser;
    constructor(
        private authenticationService: AuthenticationService
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
                    this.user = {} as EBGSUser;
                }
            });
    }

    getUser() {
        this.authenticationService
            .getUser()
            .subscribe(user => { this.user = user });
    }

    removeFaction(name: string) {
        this.authenticationService
            .removeFaction(name)
            .subscribe(status => {
                this.getUser();
            })
    }

    removeSystem(name: string) {
        this.authenticationService
            .removeSystem(name)
            .subscribe(status => {
                this.getUser();
            })
    }

    removeEditableFaction(name: string) {
        this.authenticationService
            .removeEditableFaction(name)
            .subscribe(status => {
                this.getUser();
            })
    }
}
