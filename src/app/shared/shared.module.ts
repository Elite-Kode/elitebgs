import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdToolbarModule, MdButtonModule, MdIconModule } from '@angular/material';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarButtonsComponent } from './toolbar-buttons.component';
import { ButtonRouterComponent } from './button-router.component';
import { ButtonExternalComponent } from './button-external.component';
import { ToolbarButtonsDirective } from './toolbar-buttons.directive';

@NgModule({
    entryComponents: [ButtonRouterComponent, ButtonExternalComponent],
    declarations: [
        ToolbarComponent,
        ToolbarButtonsComponent,
        ButtonRouterComponent,
        ButtonExternalComponent,
        ToolbarButtonsDirective
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MdToolbarModule,
        MdButtonModule,
        MdIconModule
    ],
    providers: [],
    exports: [ToolbarComponent]
})
export class SharedModule { }
