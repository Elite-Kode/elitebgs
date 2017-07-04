import { Component, AfterViewInit } from '@angular/core';
import { ToolbarService } from './../shared/toolbar.service';

@Component({
    templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {
    constructor(private toolbarService: ToolbarService) { }

    ngAfterViewInit() {
        this.toolbarService.setTitle('Oops...');
        this.toolbarService.setShowBack(true);
    }
}
