import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BGSBotComponent } from './bgsbot.component';
import { BGSBotOverviewComponent } from './overview/bgsbot-overview.component';
import { BGSBotDocsComponent } from './docs/bgsbot-docs.component';

const bgsBotRoutes: Routes = [
    {
        path: 'bgsbot',
        component: BGSBotComponent,
        children: [
            {
                path: '',
                component: BGSBotOverviewComponent
            },
            {
                path: 'docs',
                component: BGSBotDocsComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(bgsBotRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class BGSBotRoutingModule { }
