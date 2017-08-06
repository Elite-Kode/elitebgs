import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { SwaggerUIModule } from '../swagger_ui/swagger-ui.module';

import { EliteBgsApiComponent } from './elite-bgs-api.component';
import { EliteBgsApiRoutingModule } from './elite-bgs-api-routing.module';
@NgModule({
    declarations: [
        EliteBgsApiComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClarityModule,
        SwaggerUIModule,
        EliteBgsApiRoutingModule
    ],
    providers: [],
    exports: [EliteBgsApiComponent]
})
export class EliteBgsModule { }
