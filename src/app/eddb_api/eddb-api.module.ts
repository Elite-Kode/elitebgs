import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdToolbarModule, MdButtonModule, MdCardModule, MdListModule } from '@angular/material';

import { EddbApiComponent } from './eddb-api.component';
import { EddbApiRoutingModule } from './eddb-api-routing.module';
import { DocsComponent } from './docs/docs.component';

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
        MdListModule
    ],
    providers: [],
    exports: [EddbApiComponent]
})
export class EddbApiModule { }
