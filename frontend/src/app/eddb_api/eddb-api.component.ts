import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-eddb-api',
    templateUrl: './eddb-api.component.html',
    styleUrls: ['./eddb-api.component.scss']
})
export class EddbApiComponent {
    @HostBinding('class.u-main-container') mainContainer = true;
    constructor() { }
}
