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
