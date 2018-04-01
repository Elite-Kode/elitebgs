import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: './privacy-policy.component.html'
})
export class PrivacyPolicyComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('Elite BGS');
    }
}
