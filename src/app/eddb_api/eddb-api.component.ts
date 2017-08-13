import { Component, HostBinding } from '@angular/core';
import { environment } from '../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { IInputSpec } from '../swagger_ui/swagger-ui.component';

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
    specs: IInputSpec[];
    constructor(private domSanitizer: DomSanitizer) {
        if (environment.production) {
            this.source = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:4001/api/eddb/v1/docs/');
        } else {
            this.source = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:3001/api/eddb/v1/docs/');
        }
        this.specs = [
            {
                versionName: 'V1',
                specLocation: '/api/eddb/v1/api-docs.json'
            },
            {
                versionName: 'V2',
                specLocation: '/api/eddb/v2/api-docs.json'
            }
        ]
    }

    onTabClick(index: number) {
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
