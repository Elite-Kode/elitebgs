import { Component, AfterViewInit } from '@angular/core';
import { ToolbarService } from './../shared/toolbar.service';
import { ToolbarButton } from './../shared/toolbar-button';

@Component({
    selector: 'eddb-api',
    templateUrl: './eddb-api.component.html',
    styleUrls: ['./eddb-api.component.scss']
})
export class EddbApiComponent implements AfterViewInit {
    toolbarButtons: ToolbarButton[];
    constructor(private toolbarService: ToolbarService) { }

    ngAfterViewInit() {
        this.toolbarButtons = [
            new ToolbarButton("text", "Home", "/api/eddb"),
            new ToolbarButton("text", "Docs", "/api/eddb/docs")
        ];

        this.toolbarService.makeButtons(this.toolbarButtons);
        this.toolbarService.setTitle('EDDB API');
        this.toolbarService.setShowBack(true);
    }
}
