import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';

import { AppComponent } from './app.component';
import { EddbApiModule } from './eddb_api/eddb-api.module';
import { EliteBgsModule } from './elite_bgs_api/elite-bgs-api.module';
import { BGSBotModule } from './bgsbot/bgsbot.module';
import { AdminModule } from './admin/admin.module';
import { MainModule } from './main/main.module';
import { CustomChartModule } from './charts/custom-chart.module';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileReportComponent } from './profile/profile-report.component';
import { OwnerInfoComponent } from './about/owner-info.component';
import { TandCTextComponent } from './about/tandc-text.component';
import { DisclaimerTextComponent } from './about/disclaimer-text.component';
import { PrivacyPolicyTextComponent } from './about/privacy-policy-text.component';
import { AboutComponent } from './about/about.component';
import { TandCComponent } from './about/tandc.component';
import { DisclaimerComponent } from './about/disclaimer.component';
import { PrivacyPolicyComponent } from './about/privacy-policy.component';
import { GuideComponent } from './guide/guide.component';
import { DonateComponent } from './donate/donate.component';
import { CreditsComponent } from './credits/credits.component';
import { PageNotFoundComponent } from './page_not_found/page-not-found.component';
import { TickComponent } from './tick/tick.component';

import { SystemsService } from './services/systems.service';
import { FactionsService } from './services/factions.service';
import { StationsService } from './services/stations.service';
import { UsersService } from './services/users.service';
import { AuthenticationService } from './services/authentication.service';
import { ServerService } from './services/server.service';
import { TryAPIService } from './services/tryapi.service';
import { ThemeService } from './services/theme.service';
import { TickService } from './services/tick.service';
import { IngameIdsService } from './services/ingameIds.service';

import { environment } from '../environments/environment';

import { Bugsnag } from '../secrets';

import bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'
import { Client } from '@bugsnag/core';

let bugsnagClient: Client = {} as Client

if (Bugsnag.use) {
    bugsnagClient = bugsnag({
        apiKey: Bugsnag.token,
        notifyReleaseStages: ['development', 'production'],
        collectUserIp: false,
        appVersion: environment.version
    })
}

export function errorHandlerFactory() {
    return new BugsnagErrorHandler(bugsnagClient);
}

const providers: Provider[] = [
    SystemsService,
    FactionsService,
    StationsService,
    UsersService,
    AuthenticationService,
    ServerService,
    ThemeService,
    TryAPIService,
    TickService,
    IngameIdsService
]

if (Bugsnag.use) {
    providers.push({provide: ErrorHandler, useFactory: errorHandlerFactory})
}

@NgModule({
    declarations: [
        AppComponent,
        ProfileComponent,
        ProfileReportComponent,
        OwnerInfoComponent,
        TandCTextComponent,
        DisclaimerTextComponent,
        PrivacyPolicyTextComponent,
        AboutComponent,
        TandCComponent,
        DisclaimerComponent,
        PrivacyPolicyComponent,
        GuideComponent,
        DonateComponent,
        CreditsComponent,
        PageNotFoundComponent,
        TickComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        LayoutModule,
        ReactiveFormsModule,
        HttpClientModule,
        EddbApiModule,
        EliteBgsModule,
        BGSBotModule,
        AdminModule,
        MainModule,
        CustomChartModule,
        AppRoutingModule,
        ClarityModule
    ],
    exports: [
        CustomChartModule
    ],
    providers: providers,
    bootstrap: [AppComponent]
})
export class AppModule {
}
