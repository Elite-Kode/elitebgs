import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IInputSpec } from '../../swagger_ui/swagger-ui.component';

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
                specLocation: '/api/ebgs/v1/api-docs.json',
                swaggerLocation: '/api/ebgs/v1/docs'
            },
            {
                versionName: 'V2',
                specLocation: '/api/ebgs/v2/api-docs.json',
                swaggerLocation: '/api/ebgs/v2/docs'
            },
            {
                versionName: 'V3',
                specLocation: '/api/ebgs/v3/api-docs.json',
                swaggerLocation: '/api/ebgs/v3/docs'
            },
            {
                versionName: 'V4',
                specLocation: '/api/ebgs/v4/api-docs.json',
                swaggerLocation: '/api/ebgs/v4/docs'
            }
        ]
    }
}
