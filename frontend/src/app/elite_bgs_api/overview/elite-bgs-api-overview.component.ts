import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-ebgs-api-overview',
    templateUrl: './elite-bgs-api-overview.component.html'
})
export class EliteBgsApiOverviewComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('Elite BGS API - Elite BGS');
    }
    apiUrl = environment.apiUrl
}
