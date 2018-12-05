import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { SwaggerUIModule } from '../swagger_ui/swagger-ui.module';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as xrange from 'highcharts/modules/xrange.src';
import * as exporting from 'highcharts/modules/exporting.src';

import { FactionInfluenceChartComponent } from './faction-influence-chart.component';
import { FactionPRStateChartComponent } from './faction-p-r-state-chart.component';
import { FactionStateChartComponent } from './faction-state-chart.component';
import { SystemInfluenceChartComponent } from './system-influence-chart.component';
import { SystemPRStateChartComponent } from './system-p-r-state-chart.component';
import { SystemStateChartComponent } from './system-state-chart.component';
import { TickChartComponent } from './tick-chart.component';

export function highchartsModules() {
    return [xrange, exporting];
}

@NgModule({
    declarations: [
        FactionInfluenceChartComponent,
        FactionPRStateChartComponent,
        FactionStateChartComponent,
        SystemInfluenceChartComponent,
        SystemPRStateChartComponent,
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
        FactionPRStateChartComponent,
        FactionStateChartComponent,
        SystemInfluenceChartComponent,
        SystemPRStateChartComponent,
        SystemStateChartComponent,
        TickChartComponent
    ]
})
export class CustomChartModule { }
