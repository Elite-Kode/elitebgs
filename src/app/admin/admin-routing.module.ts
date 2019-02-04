import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminOverviewComponent } from './overview/admin-overview.component';
import { AdminUsersListComponent } from './users/admin-users-list.component';
import { AdminUsersViewComponent } from './users/admin-users-view.component';
import { AdminSystemsListComponent } from './systems/admin-systems-list.component';
import { AdminSystemsViewComponent } from './systems/admin-systems-view.component';
import { AdminFactionsComponent } from './factions/admin-factions.component';
import { AdminStationsComponent } from './stations/admin-stations.component';

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
                path: 'system/:userid',
                component: AdminSystemsViewComponent
            },
            {
                path: 'faction',
                component: AdminFactionsComponent
            },
            {
                path: 'station',
                component: AdminStationsComponent
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
