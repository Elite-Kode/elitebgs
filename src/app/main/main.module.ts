import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
// import { xrange } from 'highcharts/modules/xrange.src';
import * as xrange from 'highcharts/modules/xrange.src';
import * as exporting from 'highcharts/modules/exporting.src';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { FactionListComponent } from './factions/faction-list.component';
import { FactionViewComponent } from './factions/faction-view.component';
import { SystemListComponent } from './systems/system-list.component';
import { SystemViewComponent } from './systems/system-view.component';
import { StationListComponent } from './stations/station-list.component';
import { StationViewComponent } from './stations/station-view.component';
import { TickComponent } from './tick/tick.component';
import { FactionInfluenceChartComponent } from './charts/faction-influence-chart.component';
import { FactionStateChartComponent } from './charts/faction-state-chart.component';
import { FactionAPRStateChartComponent } from './charts/faction-a-p-r-state-chart.component';
import { SystemInfluenceChartComponent } from './charts/system-influence-chart.component';
import { SystemStateChartComponent } from './charts/system-state-chart.component';
import { SystemAPRStateChartComponent } from './charts/system-a-p-r-state-chart.component';
import { TickChartComponent } from './charts/tick-chart.component';
import { MainRoutingModule } from './main-routing.module';

export function highchartsModules() {
    return [xrange, exporting];
}

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
        SystemListComponent,
        SystemViewComponent,
        FactionListComponent,
        FactionViewComponent,
        StationListComponent,
        StationViewComponent,
        TickComponent,
        SystemInfluenceChartComponent,
        FactionInfluenceChartComponent,
        SystemStateChartComponent,
        TickChartComponent,
        SystemAPRStateChartComponent,
        FactionStateChartComponent,
        FactionAPRStateChartComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        ChartModule,
        MainRoutingModule
    ],
    exports: [MainComponent],
    providers: [
        { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
    ]
})
export class MainModule { }
