import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { SwaggerUIModule } from '../swagger_ui/swagger-ui.module';

import { EddbApiComponent } from './eddb-api.component';
import { EddbApiRoutingModule } from './eddb-api-routing.module';
@NgModule({
    declarations: [
        EddbApiComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClarityModule,
        SwaggerUIModule,
        EddbApiRoutingModule
    ],
    providers: [],
    exports: [EddbApiComponent]
})
export class EddbApiModule { }
