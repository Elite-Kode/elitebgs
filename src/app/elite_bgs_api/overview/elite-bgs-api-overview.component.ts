import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-ebgs-api-overview',
    templateUrl: './elite-bgs-api-overview.component.html'
})
export class EliteBgsApiOverviewComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
