import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EddbApiComponent } from './eddb-api.component';

const eddbApiRoutes: Routes = [
    {
        path: 'api/eddb',
        component: EddbApiComponent
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
