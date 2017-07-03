import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdToolbarModule, MdButtonModule, MdCardModule, MdListModule, MdIconModule } from '@angular/material';

import { EddbApiComponent } from './eddb-api.component';
import { EddbApiRoutingModule } from './eddb-api-routing.module';
import { DocsComponent } from './docs/docs.component';
import { SharedModule } from './../shared/shared.module';

@NgModule({
    declarations: [
        EddbApiComponent,
        DocsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        EddbApiRoutingModule,
        MdToolbarModule,
        MdButtonModule,
        MdCardModule,
        MdListModule,
        MdIconModule,
        SharedModule
    ],
    providers: [],
    exports: [EddbApiComponent]
})
export class EddbApiModule { }
