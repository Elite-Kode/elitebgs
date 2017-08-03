import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    systemActive = true;
    factionActive = false;

    constructor() { }

    onTabIndexChanged(index: number) {
        switch (index) {
            case 0: {
                this.systemActive = true;
                this.factionActive = false;
                break;
            }
            case 1: {
                this.factionActive = true;
                this.systemActive = false;
                break;
            }
        }
    }
}
