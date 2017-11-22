import { Component, HostBinding } from '@angular/core';

@Component({
    templateUrl: './tandc.component.html'
})
export class TandCComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
