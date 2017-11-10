import { Component, HostBinding } from '@angular/core';

@Component({
    templateUrl: './disclaimer.component.html'
})
export class DisclaimerComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
