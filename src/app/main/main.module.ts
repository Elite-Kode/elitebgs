import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ChartModule } from 'angular2-highcharts';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { FactionListComponent } from './factions/faction-list.component';
import { FactionViewComponent } from './factions/faction-view.component';
import { SystemListComponent } from './systems/system-list.component';
import { SystemViewComponent } from './systems/system-view.component';
import { FactionChartComponent } from './charts/faction-chart.component';
import { SystemChartComponent } from './charts/system-chart.component';
import { SystemEditComponent } from './edit_modals/system-edit.component';
import { MainRoutingModule } from './main-routing.module';

import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

export declare let require: any;
export function highchartsFactory() {
    const hc = require('highcharts');
    return hc;
}

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
        SystemListComponent,
        SystemViewComponent,
        FactionListComponent,
        FactionViewComponent,
        SystemChartComponent,
        FactionChartComponent,
        SystemEditComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule.forRoot(),
        ChartModule,
        MainRoutingModule
    ],
    providers: [{
        provide: HighchartsStatic,
        useFactory: highchartsFactory
    }],
    exports: [MainComponent]
})
export class MainModule { }
