import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page_not_found/page-not-found.component';
import { HomeComponent } from './home.component';
import { SystemViewComponent } from './system-view.component';
import { FactionViewComponent } from './faction-view.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'system/:systemid', component: SystemViewComponent },
    { path: 'faction/:factionid', component: FactionViewComponent },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
