import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-admin-factions',
    templateUrl: './admin-factions.component.html'
})
export class AdminFactionsComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
