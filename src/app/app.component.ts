import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
import { ThemeService } from './services/theme.service';
import { EBGSUser, GalacticTick } from 'app/typings';
import { TickService } from './services/tick.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: []
})
export class AppComponent implements OnInit {
    isAuthenticated: boolean;
    user: EBGSUser;
    linkRef: HTMLLinkElement;
    galacticTick: GalacticTick;
    galacticTickUpdate: GalacticTick;
    tickModal = false;

    constructor(
        private authenticationService: AuthenticationService,
        private themeService: ThemeService,
        private tickService: TickService,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.linkRef = this.document.createElement('link');
            this.linkRef.rel = 'stylesheet';
            this.linkRef.href = this.themeService.getTheme().href;
            this.linkRef.onload = () => this.themeService.themeLoaded();
            this.document.querySelector('head').appendChild(this.linkRef);
        }
        this.galacticTick = <GalacticTick>{};
        this.galacticTickUpdate = <GalacticTick>{};
    }

    ngOnInit(): void {
        this.getAuthentication();
        this.getGalacticTick();
    }

    getGalacticTick() {
        this.tickService
            .getGalacticTick()
            .subscribe(galacticTick => {
                this.galacticTick = this.tickService.formatTickTime(galacticTick);
                this.galacticTickUpdate = this.tickService.getUpdateTimeFromTick(galacticTick);
            });
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

    switchTheme() {
        if (this.themeService.getTheme().name === 'light') {
            this.themeService.setTheme('dark');
        } else {
            this.themeService.setTheme('light');
        }
        this.linkRef.href = this.themeService.getTheme().href;
    }

    getThemeName() {
        return this.themeService.getTheme().name;
    }
}
