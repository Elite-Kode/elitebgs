import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EliteBgsApiComponent } from './elite-bgs-api.component';
import { EliteBgsApiOverviewComponent } from './overview/elite-bgs-api-overview.component';
import { EliteBgsApiDocsComponent } from './docs/elite-bgs-api-docs.component';

const eliteBgsApiRoutes: Routes = [
    {
        path: 'apis/ebgs',
        component: EliteBgsApiComponent,
        children: [
            {
                path: '',
                component: EliteBgsApiOverviewComponent
            },
            {
                path: 'docs',
                component: EliteBgsApiDocsComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(eliteBgsApiRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class EliteBgsApiRoutingModule { }
