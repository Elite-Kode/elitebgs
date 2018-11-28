import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { AppComponent } from './app.component';
import { EddbApiModule } from './eddb_api/eddb-api.module';
import { EliteBgsModule } from './elite_bgs_api/elite-bgs-api.module';
import { BGSBotModule } from './bgsbot/bgsbot.module';
import { AdminModule } from './admin/admin.module';
import { MainModule } from './main/main.module';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileReportComponent } from './profile/profile-report.component';
import { AboutComponent } from './about/about.component';
import { TandCComponent } from './about/tandc.component';
import { DisclaimerComponent } from './about/disclaimer.component';
import { PrivacyPolicyComponent } from './about/privacy-policy.component';
import { GuideComponent } from './guide/guide.component';
import { DonateComponent } from './donate/donate.component';
import { CreditsComponent } from './credits/credits.component';
import { PageNotFoundComponent } from './page_not_found/page-not-found.component';

import { SystemsService } from './services/systems.service';
import { FactionsService } from './services/factions.service';
import { StationsService } from './services/stations.service';
import { AuthenticationService } from './services/authentication.service';
import { ServerService } from './services/server.service';
import { TryAPIService } from './services/tryapi.service';
import { ThemeService } from './services/theme.service';
import { TickService } from './services/tick.service';

@NgModule({
    declarations: [
        AppComponent,
        ProfileComponent,
        ProfileReportComponent,
        AboutComponent,
        TandCComponent,
        DisclaimerComponent,
        PrivacyPolicyComponent,
        GuideComponent,
        DonateComponent,
        CreditsComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'elitebgs' }),
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        EddbApiModule,
        EliteBgsModule,
        BGSBotModule,
        AdminModule,
        MainModule,
        AppRoutingModule,
        ClarityModule
    ],
    providers: [
        SystemsService,
        FactionsService,
        StationsService,
        AuthenticationService,
        ServerService,
        ThemeService,
        TryAPIService,
        TickService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
