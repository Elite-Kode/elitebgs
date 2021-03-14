import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IInputSpec } from '../../swagger_ui/swagger-ui.component';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-ebgs-api-docs',
    templateUrl: './elite-bgs-api-docs.component.html'
})
export class EliteBgsApiDocsComponent {
    @HostBinding('class.u-main-container') mainContainer = true;
    specs: IInputSpec[];
    constructor(private titleService: Title) {
        this.titleService.setTitle('Elite BGS API Docs - Elite BGS');
        this.specs = [
            {
                versionName: 'V1',
                specLocation: environment.apiUrl + '/api/ebgs/v1/api-docs.json',
                swaggerLocation: environment.apiUrl + '/api/ebgs/v1/docs'
            },
            {
                versionName: 'V2',
                specLocation: environment.apiUrl + '/api/ebgs/v2/api-docs.json',
                swaggerLocation: environment.apiUrl + '/api/ebgs/v2/docs'
            },
            {
                versionName: 'V3',
                specLocation: environment.apiUrl + '/api/ebgs/v3/api-docs.json',
                swaggerLocation: environment.apiUrl + '/api/ebgs/v3/docs'
            },
            {
                versionName: 'V4',
                specLocation: environment.apiUrl + '/api/ebgs/v4/api-docs.json',
                swaggerLocation: environment.apiUrl + '/api/ebgs/v4/docs'
            },
            {
                versionName: 'V5',
                specLocation: environment.apiUrl + '/api/ebgs/v5/api-docs.json',
                swaggerLocation: environment.apiUrl + '/api/ebgs/v5/docs'
            }
        ]
    }
}
