import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'app-ebgs-api',
    templateUrl: './elite-bgs-api.component.html',
    styleUrls: ['./elite-bgs-api.component.scss']
})
export class EliteBgsApiComponent implements OnInit {
    @HostBinding('class.content-area') hostClass = false;
    constructor() { }

    ngOnInit() {
        this.hostClass = true;
    }
}
