import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { FactionListComponent } from './factions/faction-list.component';
import { FactionViewComponent } from './factions/faction-view.component';
import { SystemListComponent } from './systems/system-list.component';
import { SystemViewComponent } from './systems/system-view.component';
import { StationListComponent } from './stations/station-list.component';
import { StationViewComponent } from './stations/station-view.component';

const mainRoutes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'system',
                component: SystemListComponent
            },
            {
                path: 'system/:systemId',
                component: SystemViewComponent
            },
            {
                path: 'faction',
                component: FactionListComponent
            },
            {
                path: 'faction/:factionId',
                component: FactionViewComponent
            },
            {
                path: 'station',
                component: StationListComponent
            },
            {
                path: 'station/:stationId',
                component: StationViewComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(mainRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
