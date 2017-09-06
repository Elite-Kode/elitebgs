import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ServerService } from '../services/server.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    @HostBinding('class.u-main-container') mainContainer = true;
    private isAuthenticated: boolean;
    backgroundImage = {};
    constructor(
        private authenticationService: AuthenticationService,
        private serverService: ServerService,
        private router: Router
    ) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.getBackground();
            }
        })
    }

    ngOnInit(): void {
        this.getAuthentication();
        this.getBackground();
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => {
                this.isAuthenticated = status;
                this.getBackground();
            });
    }

    getBackground() {
        if (this.isAuthenticated !== undefined && !this.isAuthenticated && this.router.url === '/') {
            this.serverService
                .getBackgroundImageFiles()
                .subscribe(files => {
                    const randomFile = Math.floor(Math.random() * files.length);
                    this.backgroundImage = {
                        'background-image': 'url(\'/assets/backgrounds/' + files[randomFile] + '\')'
                    };
                })
        } else {
            this.backgroundImage = {};
        }
    }

    setFlex() {
        if (!this.isAuthenticated && this.router.url === '/') {
            return {
                'display': 'flex'
            };
        } else {
            return {};
        }
    }
}
