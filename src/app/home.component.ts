import { Component, AfterViewInit } from '@angular/core';
import { ToolbarService } from './shared/toolbar.service';
import { ToolbarButton } from './shared/toolbar-button';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
    toolbarButtons: ToolbarButton[];
    constructor(private toolbarService: ToolbarService) { }

    ngAfterViewInit() {
        this.toolbarButtons = [
            new ToolbarButton("text", "EDDB API", "router", "./api/eddb"),
            new ToolbarButton("text", "Elite BGS API", "router", "./api/elitebgs")
        ];

        this.toolbarService.makeButtons(this.toolbarButtons);
        this.toolbarService.setTitle('Elite BGS');
        this.toolbarService.setShowBack(false);
    }
}
