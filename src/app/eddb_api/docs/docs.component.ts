import { Component, AfterViewInit } from '@angular/core';
import { ToolbarService } from './../../shared/toolbar.service';
import { ToolbarButton } from './../../shared/toolbar-button';

@Component({
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements AfterViewInit {
    toolbarButtons: ToolbarButton[];
    constructor(private toolbarService: ToolbarService) { }

    ngAfterViewInit() {
        this.toolbarButtons = [
            new ToolbarButton("text", "Home", "/api/eddb"),
            new ToolbarButton("text", "Docs", "/api/eddb/docs")
        ];

        this.toolbarService.makeButtons(this.toolbarButtons);
        this.toolbarService.setTitle('EDDB API Docs');
        this.toolbarService.setShowBack(true);
    }
}
