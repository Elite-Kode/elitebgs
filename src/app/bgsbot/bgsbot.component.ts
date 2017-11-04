import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-bgsbot',
    templateUrl: './bgsbot.component.html',
    styleUrls: ['./bgsbot.component.scss']
})
export class BGSBotComponent {
    @HostBinding('class.u-main-container') mainContainer = true;
    constructor() { }
}
