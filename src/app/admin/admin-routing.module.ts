import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminOverviewComponent } from './overview/admin-overview.component';
import { AdminUsersListComponent } from './users/admin-users-list.component';
import { AdminUsersViewComponent } from './users/admin-users-view.component';
import { AdminSystemsListComponent } from './systems/admin-systems-list.component';
import { AdminSystemsViewComponent } from './systems/admin-systems-view.component';
import { AdminFactionsListComponent } from './factions/admin-factions-list.component';
import { AdminFactionsViewComponent } from './factions/admin-factions-view.component';
import { AdminStationListComponent } from './stations/admin-station-list.component';
import { AdminStationViewComponent } from './stations/admin-station-view.component';

const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: AdminOverviewComponent
            },
            {
                path: 'user',
                component: AdminUsersListComponent
            },
            {
                path: 'user/:userid',
                component: AdminUsersViewComponent
            },
            {
                path: 'system',
                component: AdminSystemsListComponent
            },
            {
                path: 'system/:systemid',
                component: AdminSystemsViewComponent
            },
            {
                path: 'faction',
                component: AdminFactionsListComponent
            },
            {
                path: 'faction/:factionid',
                component: AdminFactionsViewComponent
            },
            {
                path: 'station',
                component: AdminStationListComponent
            },
            {
                path: 'station/:stationid',
                component: AdminStationViewComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule { }
