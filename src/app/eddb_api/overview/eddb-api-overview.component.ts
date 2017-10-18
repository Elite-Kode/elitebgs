import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-eddb-api-overview',
    templateUrl: './eddb-api-overview.component.html'
})
export class EddbApiOverviewComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor() { }
}
