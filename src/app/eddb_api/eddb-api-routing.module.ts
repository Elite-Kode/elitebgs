import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EddbApiComponent } from './eddb-api.component';
import { EddbApiOverviewComponent } from './overview/eddb-api-overview.component';
import { EddbApiDocsComponent } from './docs/eddb-api-docs.component';

const eddbApiRoutes: Routes = [
    {
        path: 'api/eddb',
        component: EddbApiComponent,
        children: [
            {
                path: '',
                component: EddbApiOverviewComponent
            },
            {
                path: 'docs',
                component: EddbApiDocsComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(eddbApiRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class EddbApiRoutingModule { }
