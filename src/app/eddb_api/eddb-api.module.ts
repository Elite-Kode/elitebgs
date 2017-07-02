import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdToolbarModule, MdButtonModule, MdCardModule } from '@angular/material';

import { EddbApiComponent } from './eddb-api.component';
import { EddbApiRoutingModule } from './eddb-api-routing.module';

@NgModule({
    declarations: [
        EddbApiComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        EddbApiRoutingModule,
        MdToolbarModule,
        MdButtonModule,
        MdCardModule
    ],
    providers: [],
    exports: [EddbApiComponent]
})
export class EddbApiModule { }
