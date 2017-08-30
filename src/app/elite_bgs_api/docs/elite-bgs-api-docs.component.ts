import { Component, HostBinding } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { IInputSpec } from '../../swagger_ui/swagger-ui.component';

@Component({
    selector: 'app-ebgs-api-docs',
    templateUrl: './elite-bgs-api-docs.component.html'
})
export class EliteBgsApiDocsComponent {
    @HostBinding('class.u-main-container') mainContainer = true;
    source;
    specs: IInputSpec[];
    constructor(private domSanitizer: DomSanitizer) {
        if (environment.production) {
            this.source = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:4001/api/ebgs/v1/docs/');
        } else {
            this.source = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:3001/api/ebgs/v1/docs/');
        }
        this.specs = [
            {
                versionName: 'V1',
                specLocation: '/api/ebgs/v1/api-docs.json'
            },
            {
                versionName: 'V2',
                specLocation: '/api/ebgs/v2/api-docs.json'
            },
            {
                versionName: 'V3',
                specLocation: '/api/ebgs/v3/api-docs.json'
            }
        ]
    }
}
