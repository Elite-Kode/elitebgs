import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-bgsbot-docs',
    templateUrl: './bgsbot-docs.component.html'
})
export class BGSBotDocsComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('BGS Bot Docs - Elite BGS');
    }
}
