import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    @HostBinding('class.u-main-container') mainContainer = true;
    constructor() { }
}
