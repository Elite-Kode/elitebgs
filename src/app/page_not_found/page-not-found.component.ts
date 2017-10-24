import { Component, HostBinding } from '@angular/core';

@Component({
    templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
