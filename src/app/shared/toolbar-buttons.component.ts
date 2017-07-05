import { Component, ViewChild, ComponentFactoryResolver, OnInit, AfterViewInit } from '@angular/core';
import { ToolbarButton } from './toolbar-button';
import { ToolbarButtonsDirective } from './toolbar-buttons.directive';
import { ToolbarService } from './toolbar.service';
import { ButtonRouterComponent } from './button-router.component';
import { ButtonExternalComponent } from './button-external.component';

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
        let ButtonRouterFactory = this.componentFactoryResolver.resolveComponentFactory(ButtonRouterComponent);
        let ButtonExternalFactory = this.componentFactoryResolver.resolveComponentFactory(ButtonExternalComponent)
        let viewContainerRef = this.buttonHost.viewConatinerRef;
        viewContainerRef.clear();

        this.toolbarButtons.forEach(button => {
            if (button.linkType === "router") {
                let componentRef = viewContainerRef.createComponent(ButtonRouterFactory);
                (<ButtonRouterComponent>componentRef.instance).button = button;
            } else if (button.linkType === "external") {
                let componentRef = viewContainerRef.createComponent(ButtonExternalFactory);
                (<ButtonExternalComponent>componentRef.instance).button = button;
            }
        });
    }
}