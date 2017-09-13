import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { ChartModule } from 'angular2-highcharts';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { FactionListComponent } from './factions/faction-list.component';
import { FactionViewComponent } from './factions/faction-view.component';
import { SystemListComponent } from './systems/system-list.component';
import { SystemViewComponent } from './systems/system-view.component';
import { MainRoutingModule } from './main-routing.module';

export declare let require: any;

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
        SystemListComponent,
        SystemViewComponent,
        FactionListComponent,
        FactionViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule.forRoot(),
        ChartModule.forRoot(require('highcharts')),
        MainRoutingModule
    ],
    providers: [],
    exports: [MainComponent]
})
export class MainModule { }
