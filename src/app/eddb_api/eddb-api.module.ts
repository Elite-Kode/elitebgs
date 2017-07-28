import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EddbApiComponent } from './eddb-api.component';
import { EddbApiRoutingModule } from './eddb-api-routing.module';

@NgModule({
    declarations: [
        EddbApiComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        EddbApiRoutingModule
    ],
    providers: [],
    exports: [EddbApiComponent]
})
export class EddbApiModule { }
