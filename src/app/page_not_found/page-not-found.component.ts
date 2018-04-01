import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('404 - Elite BGS');
    }
}
