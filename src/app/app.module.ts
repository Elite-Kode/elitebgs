import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ClarityModule } from 'clarity-angular';

import { AppComponent } from './app.component';
import { EddbApiModule } from './eddb_api/eddb-api.module';
import { EliteBgsModule } from './elite_bgs_api/elite-bgs-api.module';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page_not_found/page-not-found.component';
import { HomeComponent } from './home.component';
import { SystemListComponent } from './system-list.component';
import { SystemViewComponent } from './system-view.component';
import { FactionListComponent } from './faction-list.component';
import { FactionViewComponent } from './faction-view.component';

import { SystemsService } from './services/systems.service';
import { FactionsService } from './services/factions.service';
import { ApiInterceptor } from './api.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        PageNotFoundComponent,
        SystemListComponent,
        SystemViewComponent,
        FactionListComponent,
        FactionViewComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        EddbApiModule,
        EliteBgsModule,
        AppRoutingModule,
        ClarityModule.forRoot()
    ],
    providers: [SystemsService, FactionsService, {
        provide: HTTP_INTERCEPTORS,
        useClass: ApiInterceptor,
        multi: true,
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
