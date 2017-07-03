import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[toolbar-buttons-holder]'
})
export class ToolbarButtonsDirective {
    constructor(public viewConatinerRef: ViewContainerRef) { };
}