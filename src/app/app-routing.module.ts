import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { TandCComponent } from './about/tandc.component';
import { DisclaimerComponent } from './about/disclaimer.component';
import { PrivacyPolicyComponent } from './about/privacy-policy.component';
import { GuideComponent } from './guide/guide.component';
import { PageNotFoundComponent } from './page_not_found/page-not-found.component';

const appRoutes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent
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
