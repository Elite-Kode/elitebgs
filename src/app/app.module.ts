import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { MdToolbarModule, MdButtonModule } from '@angular/material';
import { Ng2TableModule } from 'ng2-table/ng2-table';

import { AppComponent } from './app.component';
import { EddbApiModule } from './eddb_api/eddb-api.module';
import { EliteBgsModule } from './elite_bgs_api/elite-bgs-api.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page_not_found/page-not-found.component';
import { HomeComponent } from './home.component';

import { ToolbarService } from './shared/toolbar.service';
import { SystemsService } from './services/systems.service';
import { ApiInterceptor } from './api.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        EddbApiModule,
        EliteBgsModule,
        SharedModule,
        AppRoutingModule,
        MdToolbarModule,
        MdButtonModule,
        Ng2TableModule
    ],
    providers: [ToolbarService, SystemsService, {
        provide: HTTP_INTERCEPTORS,
        useClass: ApiInterceptor,
        multi: true,
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
