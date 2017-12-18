import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-admin-overview',
    templateUrl: './admin-overview.component.html'
})
export class AdminOverviewComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
