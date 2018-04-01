import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('Elite BGS');
    }
}
