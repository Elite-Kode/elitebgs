import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { TickComponent } from './tick/tick.component';

const appRoutes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'profile/report',
        component: ProfileReportComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'about/termsandconditions',
        component: TandCComponent
    },
    {
        path: 'about/disclaimer',
        component: DisclaimerComponent
    },
    {
        path: 'about/privacypolicy',
        component: PrivacyPolicyComponent
    },
    {
        path: 'guide',
        component: GuideComponent
    },
    {
        path: 'donate',
        component: DonateComponent
    },
    {
        path: 'credits',
        component: CreditsComponent
    },
    {
        path: 'tick',
        component: TickComponent
    },
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
