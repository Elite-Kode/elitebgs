import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminOverviewComponent } from './overview/admin-overview.component';
import { AdminUsersComponent } from './users/admin-users.component';
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
                component: AdminUsersComponent
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
