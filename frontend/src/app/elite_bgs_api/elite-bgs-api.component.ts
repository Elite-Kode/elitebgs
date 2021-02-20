import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-ebgs-api',
    templateUrl: './elite-bgs-api.component.html',
    styleUrls: ['./elite-bgs-api.component.scss']
})
export class EliteBgsApiComponent {
    @HostBinding('class.u-main-container') mainContainer = true;
    constructor() { }
}
