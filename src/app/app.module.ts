import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ClarityModule } from 'clarity-angular';

import { AppComponent } from './app.component';
import { EddbApiModule } from './eddb_api/eddb-api.module';
import { EliteBgsModule } from './elite_bgs_api/elite-bgs-api.module';
import { MainModule } from './main/main.module';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page_not_found/page-not-found.component';

import { SystemsService } from './services/systems.service';
import { FactionsService } from './services/factions.service';
import { AuthenticationService } from './services/authentication.service';
import { ServerService } from './services/server.service';

@NgModule({
    declarations: [
        AppComponent,
        ProfileComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        EddbApiModule,
        EliteBgsModule,
        MainModule,
        AppRoutingModule,
        ClarityModule.forRoot()
    ],
    providers: [SystemsService, FactionsService, AuthenticationService, ServerService],
    bootstrap: [AppComponent]
})
export class AppModule { }
