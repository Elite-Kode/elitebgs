import { Component, ViewChild, ComponentFactoryResolver, OnInit, AfterViewInit } from '@angular/core';
import { ToolbarButton } from './toolbar-button';
import { ToolbarButtonsDirective } from './toolbar-buttons.directive';
import { ToolbarService } from './toolbar.service';
import { ButtonComponent } from './button.component';

@Component({
    selector: 'toolbar-buttons',
    template: `<div><ng-template toolbar-buttons-holder></ng-template></div>`
})
export class ToolbarButtonsComponent implements AfterViewInit {
    toolbarButtons: ToolbarButton[];
    @ViewChild(ToolbarButtonsDirective) buttonHost: ToolbarButtonsDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private toolbarService: ToolbarService
    ) { }

    ngAfterViewInit() {
        this.toolbarService.getButtons().subscribe((buttons: ToolbarButton[]) => {
            this.toolbarButtons = buttons;
            this.loadButtons();
        });
    }

    loadButtons(): void {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ButtonComponent);
        let viewContainerRef = this.buttonHost.viewConatinerRef;
        viewContainerRef.clear();

        this.toolbarButtons.forEach(button => {
            let componentRef = viewContainerRef.createComponent(componentFactory);

            (<ButtonComponent>componentRef.instance).button = button;
        });
    }
}