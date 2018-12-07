import { NgModule } from '@angular/core';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as xrange from 'highcharts/modules/xrange.src';
import * as exporting from 'highcharts/modules/exporting.src';

import { FactionInfluenceChartComponent } from './faction-influence-chart.component';
import { FactionAPRStateChartComponent } from './faction-a-p-r-state-chart.component';
import { FactionStateChartComponent } from './faction-state-chart.component';
import { SystemInfluenceChartComponent } from './system-influence-chart.component';
import { SystemAPRStateChartComponent } from './system-a-p-r-state-chart.component';
import { SystemStateChartComponent } from './system-state-chart.component';
import { TickChartComponent } from './tick-chart.component';

export function highchartsModules() {
    return [xrange, exporting];
}

@NgModule({
    declarations: [
        FactionInfluenceChartComponent,
        FactionAPRStateChartComponent,
        FactionStateChartComponent,
        SystemInfluenceChartComponent,
        SystemAPRStateChartComponent,
        SystemStateChartComponent,
        TickChartComponent
    ],
    imports: [
        ChartModule
    ],
    providers: [
        { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
    ],
    exports: [
        FactionInfluenceChartComponent,
        FactionAPRStateChartComponent,
        FactionStateChartComponent,
        SystemInfluenceChartComponent,
        SystemAPRStateChartComponent,
        SystemStateChartComponent,
        TickChartComponent
    ]
})
export class CustomChartModule { }
