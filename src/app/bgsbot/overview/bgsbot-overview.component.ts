import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-bgsbot-overview',
    templateUrl: './bgsbot-overview.component.html'
})
export class BGSBotOverviewComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
