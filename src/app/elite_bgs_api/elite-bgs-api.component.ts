import { Component } from '@angular/core';

@Component({
    selector: 'app-ebgs-api',
    templateUrl: './elite-bgs-api.component.html',
    styleUrls: ['./elite-bgs-api.component.scss']
})
export class EliteBgsApiComponent {
    overviewActive = true;
    docsActive = false;

    constructor() { }

    onTabIndexChanged(index: number) {
        switch (index) {
            case 0: {
                this.overviewActive = true;
                this.docsActive = false;
                break;
            }
            case 1: {
                this.docsActive = true;
                this.overviewActive = false;
                break;
            }
        }
    }
}
