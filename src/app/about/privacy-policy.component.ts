import { Component, HostBinding } from '@angular/core';

@Component({
    templateUrl: './privacy-policy.component.html'
})
export class PrivacyPolicyComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
