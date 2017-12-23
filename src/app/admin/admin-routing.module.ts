import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminOverviewComponent } from './overview/admin-overview.component';
import { AdminUsersListComponent } from './users/admin-users-list.component';
import { AdminUsersViewComponent } from './users/admin-users-view.component';
import { AdminSystemsComponent } from './systems/admin-systems.component';
import { AdminFactionsComponent } from './factions/admin-factions.component';

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
                path: 'users',
                component: AdminUsersListComponent
            },
            {
                path: 'users/:userid',
                component: AdminUsersViewComponent
            },
            {
                path: 'systems',
                component: AdminSystemsComponent
            },
            {
                path: 'factions',
                component: AdminFactionsComponent
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
