import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-bgsbot-docs',
    templateUrl: './bgsbot-docs.component.html'
})
export class BGSBotDocsComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
