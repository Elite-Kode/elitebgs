import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { SwaggerUIComponent } from './swagger-ui.component';
@NgModule({
    declarations: [
        SwaggerUIComponent
    ],
    imports: [
        CommonModule,
        ClarityModule
    ],
    providers: [],
    exports: [SwaggerUIComponent]
})
export class SwaggerUIModule { }
