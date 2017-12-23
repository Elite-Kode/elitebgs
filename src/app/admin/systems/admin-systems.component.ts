import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-admin-systems',
    templateUrl: './admin-systems.component.html'
})
export class AdminSystemsComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
