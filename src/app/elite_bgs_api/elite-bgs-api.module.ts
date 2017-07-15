import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdToolbarModule, MdButtonModule, MdCardModule, MdListModule, MdIconModule } from '@angular/material';

import { EliteBgsApiComponent } from './elite-bgs-api.component';
import { EliteBgsApiRoutingModule } from './elite-bgs-api-routing.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
    declarations: [
        EliteBgsApiComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        EliteBgsApiRoutingModule,
        MdToolbarModule,
        MdButtonModule,
        MdCardModule,
        MdListModule,
        MdIconModule,
        SharedModule
    ],
    providers: [],
    exports: [EliteBgsApiComponent]
})
export class EliteBgsModule { }
