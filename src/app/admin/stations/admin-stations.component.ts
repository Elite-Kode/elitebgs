import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-admin-stations',
    templateUrl: './admin-stations.component.html'
})
export class AdminStationsComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
