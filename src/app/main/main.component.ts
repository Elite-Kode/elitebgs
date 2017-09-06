import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    @HostBinding('class.u-main-container') mainContainer = true;
    private isAuthenticated = false;
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getAuthentication();
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => { this.isAuthenticated = status });
    }

    getBackground() {
        if (!this.isAuthenticated && this.router.url === '/') {
            return {
                'background-image': 'url(\'/assets/backgrounds/blueness.png\')'
            };
        } else {
            return {};
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
