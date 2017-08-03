import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-ebgs-api',
    templateUrl: './elite-bgs-api.component.html',
    styleUrls: ['./elite-bgs-api.component.scss']
})
export class EliteBgsApiComponent {
    overviewActive = true;
    docsActive = false;
    source;
    constructor(private domSanitizer: DomSanitizer) {
        if (environment.production) {
            this.source = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:4001/api/ebgs/v1/docs/');
        } else {
            this.source = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:3001/api/ebgs/v1/docs/');
        }
    }

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
