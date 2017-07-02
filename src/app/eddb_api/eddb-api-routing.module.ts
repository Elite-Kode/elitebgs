import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EddbApiComponent } from './eddb-api.component';
import { DocsComponent } from './docs/docs.component';

const eddbApiRoutes: Routes = [
    {
        path: 'api/eddb',
        component: EddbApiComponent
    },
    {
        path: 'api/eddb/docs',
        component: DocsComponent
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
