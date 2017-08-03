import { Component } from '@angular/core';

@Component({
    selector: 'app-eddb-api',
    templateUrl: './eddb-api.component.html',
    styleUrls: ['./eddb-api.component.scss']
})
export class EddbApiComponent {
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
