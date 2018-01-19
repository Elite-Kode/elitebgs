import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { SwaggerUIModule } from '../swagger_ui/swagger-ui.module';

import { EliteBgsApiComponent } from './elite-bgs-api.component';
import { EliteBgsApiOverviewComponent } from './overview/elite-bgs-api-overview.component';
import { EliteBgsApiDocsComponent } from './docs/elite-bgs-api-docs.component';
import { EliteBgsApiRoutingModule } from './elite-bgs-api-routing.module';
@NgModule({
    declarations: [
        EliteBgsApiComponent,
        EliteBgsApiOverviewComponent,
        EliteBgsApiDocsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClarityModule.forRoot(),
        SwaggerUIModule,
        EliteBgsApiRoutingModule
    ],
    providers: [],
    exports: [EliteBgsApiComponent]
})
export class EliteBgsModule { }
