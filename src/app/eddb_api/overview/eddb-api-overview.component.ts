import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-eddb-api-overview',
    templateUrl: './eddb-api-overview.component.html'
})
export class EddbApiOverviewComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('EDDB API - Elite BGS');
    }
}
