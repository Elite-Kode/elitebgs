import { Component, HostBinding } from '@angular/core';
import { environment } from '../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-eddb-api',
    templateUrl: './eddb-api.component.html',
    styleUrls: ['./eddb-api.component.scss']
})
export class EddbApiComponent {
    @HostBinding('class.u-main-container') mainContainer = true;
    overviewActive = true;
    docsActive = false;
    source;
    constructor(private domSanitizer: DomSanitizer) {
        if (environment.production) {
            this.source = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:4001/api/eddb/v1/docs/');
        } else {
            this.source = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:3001/api/eddb/v1/docs/');
        }
    }

    onTabIndexChanged(index: number) {
        switch (index) {
            case 0: this.overviewActive = true;
                this.docsActive = false;
                break;
            case 1: this.docsActive = true;
                this.overviewActive = false;
                break;
        }
    }
}
