import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-admin-users',
    templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
