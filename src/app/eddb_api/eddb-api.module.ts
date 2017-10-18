import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { SwaggerUIModule } from '../swagger_ui/swagger-ui.module';

import { EddbApiComponent } from './eddb-api.component';
import { EddbApiOverviewComponent } from './overview/eddb-api-overview.component';
import { EddbApiDocsComponent } from './docs/eddb-api-docs.component';
import { EddbApiRoutingModule } from './eddb-api-routing.module';
@NgModule({
    declarations: [
        EddbApiComponent,
        EddbApiOverviewComponent,
        EddbApiDocsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClarityModule.forRoot(),
        SwaggerUIModule,
        EddbApiRoutingModule
    ],
    providers: [],
    exports: [EddbApiComponent]
})
export class EddbApiModule { }
