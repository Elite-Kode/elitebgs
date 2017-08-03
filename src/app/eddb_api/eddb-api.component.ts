import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'app-eddb-api',
    templateUrl: './eddb-api.component.html',
    styleUrls: ['./eddb-api.component.scss']
})
export class EddbApiComponent implements OnInit {
    @HostBinding('class.content-area') hostClass = false;
    constructor() { }

    ngOnInit() {
        this.hostClass = true;
    }
}
