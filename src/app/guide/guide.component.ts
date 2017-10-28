import { Component, HostBinding } from '@angular/core';

@Component({
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.scss']
})
export class GuideComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
