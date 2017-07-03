import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdToolbarModule, MdButtonModule, MdIconModule } from '@angular/material';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarButtonsComponent } from './toolbar-buttons.component';
import { ButtonComponent } from './button.component';
import { ToolbarButtonsDirective } from './toolbar-buttons.directive';

@NgModule({
    entryComponents: [ButtonComponent],
    declarations: [
        ToolbarComponent,
        ToolbarButtonsComponent,
        ButtonComponent,
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
