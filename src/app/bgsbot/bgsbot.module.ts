import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { BGSBotComponent } from './bgsbot.component';
import { BGSBotOverviewComponent } from './overview/bgsbot-overview.component';
import { BGSBotDocsComponent } from './docs/bgsbot-docs.component';
import { BGSBotRoutingModule } from './bgsbot-routing.module';
@NgModule({
    declarations: [
        BGSBotComponent,
        BGSBotOverviewComponent,
        BGSBotDocsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClarityModule.forRoot(),
        BGSBotRoutingModule
    ],
    providers: [],
    exports: [BGSBotComponent]
})
export class BGSBotModule { }
