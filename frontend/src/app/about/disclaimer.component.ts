import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: './disclaimer.component.html'
})
export class DisclaimerComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('Elite BGS');
    }
}
