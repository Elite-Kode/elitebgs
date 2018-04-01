import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { EBGSUser } from 'app/typings';
import { IDeleteMethodsSchema } from './profile.interface';

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
    warningModal: boolean;
    warningText: String;
    selectedDeleteMethod: string;
    selectedDeleteParameters: any[];
    deleteMethods: IDeleteMethodsSchema;
    constructor(
        private authenticationService: AuthenticationService,
        private titleService: Title,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.deleteMethods = {
            removeFaction: () => {
                this.authenticationService
                    .removeFaction(this.selectedDeleteParameters[0])
                    .subscribe(status => {
                        this.getUser();
                    });
            },
            removeSystem: () => {
                this.authenticationService
                    .removeSystem(this.selectedDeleteParameters[0])
                    .subscribe(status => {
                        this.getUser();
                    });
            },
            removeEditableFaction: () => {
                this.authenticationService
                    .removeEditableFaction(this.selectedDeleteParameters[0])
                    .subscribe(status => {
                        this.getUser();
                    });
            },
            deleteAccount: () => {
                this.authenticationService
                    .removeUser(this.user._id)
                    .subscribe(status => {
                        this.document.location.href = '/auth/logout';
                    });
            }
        }
        this.titleService.setTitle('Profile - Elite BGS');
    }

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
        this.selectedDeleteMethod = 'removeFaction';
        this.warningText = `Would you like to delete the faction ${name}?`;
        this.selectedDeleteParameters = [name];
        this.warningModal = true;
    }

    removeSystem(name: string) {
        this.selectedDeleteMethod = 'removeSystem';
        this.warningText = `Would you like to delete the system ${name}?`;
        this.selectedDeleteParameters = [name];
        this.warningModal = true;
    }

    removeEditableFaction(name: string) {
        this.selectedDeleteMethod = 'removeEditableFaction';
        this.warningText = `Would you like to delete the editable faction ${name}?`;
        this.selectedDeleteParameters = [name];
        this.warningModal = true;
    }

    deleteAccount() {
        this.selectedDeleteMethod = 'deleteAccount';
        this.warningText = `Would you like to delete your user account? Warning!This action is irreversible and all account related data will be permanently lost.`;
        this.selectedDeleteParameters = [];
        this.warningModal = true;
    }

    closeWarningModal() {
        this.warningModal = false;
    }

    deleteConfirmed() {
        this.deleteMethods[this.selectedDeleteMethod]();
        this.warningModal = false;
        this.warningText = null;
        this.selectedDeleteMethod = null;
        this.selectedDeleteParameters = null;
    }
}
