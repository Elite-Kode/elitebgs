import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-bgsbot-overview',
    templateUrl: './bgsbot-overview.component.html'
})
export class BGSBotOverviewComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('BGS Bot - Elite BGS');
    }
}
