import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EliteBgsApiComponent } from './elite-bgs-api.component';

const eliteBgsApiRoutes: Routes = [
    {
        path: 'api/elitebgs',
        component: EliteBgsApiComponent
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
