import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { IInputSpec } from '../../swagger_ui/swagger-ui.component';

@Component({
    selector: 'app-eddb-api-docs',
    templateUrl: './eddb-api-docs.component.html'
})
export class EddbApiDocsComponent {
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
}
