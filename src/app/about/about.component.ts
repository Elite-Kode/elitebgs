import { Component, HostBinding } from '@angular/core';

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
