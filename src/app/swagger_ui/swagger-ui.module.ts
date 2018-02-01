import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { SwaggerUIComponent } from './swagger-ui.component';
@NgModule({
    declarations: [
        SwaggerUIComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule.forRoot()
    ],
    providers: [],
    exports: [SwaggerUIComponent]
})
export class SwaggerUIModule { }
