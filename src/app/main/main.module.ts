import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

// import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
// import * as xrange from 'highcharts/modules/xrange.src';
// import * as exporting from 'highcharts/modules/exporting.src';
import { CustomChartModule } from '../charts/custom-chart.module';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { FactionListComponent } from './factions/faction-list.component';
import { FactionViewComponent } from './factions/faction-view.component';
import { SystemListComponent } from './systems/system-list.component';
import { SystemViewComponent } from './systems/system-view.component';
import { StationListComponent } from './stations/station-list.component';
import { StationViewComponent } from './stations/station-view.component';
import { MainRoutingModule } from './main-routing.module';

// export function highchartsModules() {
//     return [xrange, exporting];
// }

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
        SystemListComponent,
        SystemViewComponent,
        FactionListComponent,
        FactionViewComponent,
        StationListComponent,
        StationViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        MainRoutingModule,
        CustomChartModule,
        // ChartModule
    ],
    // providers: [
    //     { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
    // ],
    exports: [MainComponent]
})
export class MainModule { }
