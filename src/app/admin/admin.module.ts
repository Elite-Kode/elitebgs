import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { AdminComponent } from './admin.component';
import { AdminOverviewComponent } from './overview/admin-overview.component';
import { AdminUsersListComponent } from './users/admin-users-list.component';
import { AdminUsersViewComponent } from './users/admin-users-view.component';
import { AdminSystemsComponent } from './systems/admin-systems.component';
import { AdminFactionsComponent } from './factions/admin-factions.component';
import { AdminRoutingModule } from './admin-routing.module';
@NgModule({
    declarations: [
        AdminComponent,
        AdminOverviewComponent,
        AdminUsersListComponent,
        AdminUsersViewComponent,
        AdminSystemsComponent,
        AdminFactionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule.forRoot(),
        AdminRoutingModule
    ],
    providers: [],
    exports: [AdminComponent]
})
export class AdminModule { }
