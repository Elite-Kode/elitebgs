import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    @HostBinding('class.u-main-container') mainContainer = true;

    constructor() { }
}
