import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ChartModule } from 'angular-highcharts';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { FactionListComponent } from './factions/faction-list.component';
import { FactionViewComponent } from './factions/faction-view.component';
import { SystemListComponent } from './systems/system-list.component';
import { SystemViewComponent } from './systems/system-view.component';
import { StationListComponent } from './stations/station-list.component';
import { StationViewComponent } from './stations/station-view.component';
import { FactionChartComponent } from './charts/faction-chart.component';
import { SystemChartComponent } from './charts/system-chart.component';
import { SystemEditComponent } from './edit_modals/system-edit.component';
import { StationEditComponent } from './edit_modals/station-edit.component';
import { MainRoutingModule } from './main-routing.module';

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
        SystemChartComponent,
        FactionChartComponent,
        SystemEditComponent,
        StationEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        ChartModule,
        MainRoutingModule
    ],
    exports: [MainComponent]
})
export class MainModule { }
