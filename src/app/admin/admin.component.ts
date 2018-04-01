import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    @HostBinding('class.u-main-container') mainContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('Admin - Elite BGS');
    }
}
