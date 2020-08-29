import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminOverviewComponent } from './overview/admin-overview.component';
import { AdminUsersListComponent } from './users/admin-users-list.component';
import { AdminUsersViewComponent } from './users/admin-users-view.component';

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
