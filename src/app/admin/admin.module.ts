import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { AdminComponent } from './admin.component';
import { AdminOverviewComponent } from './overview/admin-overview.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminSystemsComponent } from './systems/admin-systems.component';
import { AdminFactionsComponent } from './factions/admin-factions.component';
import { AdminRoutingModule } from './admin-routing.module';
@NgModule({
    declarations: [
        AdminComponent,
        AdminOverviewComponent,
        AdminUsersComponent,
        AdminSystemsComponent,
        AdminFactionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClarityModule.forRoot(),
        AdminRoutingModule
    ],
    providers: [],
    exports: [AdminComponent]
})
export class AdminModule { }
