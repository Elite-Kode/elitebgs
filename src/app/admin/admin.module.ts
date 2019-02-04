import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { AdminComponent } from './admin.component';
import { AdminOverviewComponent } from './overview/admin-overview.component';
import { AdminUsersListComponent } from './users/admin-users-list.component';
import { AdminUsersViewComponent } from './users/admin-users-view.component';
import { AdminSystemsListComponent } from './systems/admin-systems-list.component';
import { AdminSystemsViewComponent } from './systems/admin-systems-view.component';
import { AdminFactionsComponent } from './factions/admin-factions.component';
import { AdminStationsComponent } from './stations/admin-stations.component';
import { AdminRoutingModule } from './admin-routing.module';
@NgModule({
    declarations: [
        AdminComponent,
        AdminOverviewComponent,
        AdminUsersListComponent,
        AdminUsersViewComponent,
        AdminSystemsListComponent,
        AdminSystemsViewComponent,
        AdminFactionsComponent,
        AdminStationsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        AdminRoutingModule
    ],
    providers: [],
    exports: [AdminComponent]
})
export class AdminModule { }
