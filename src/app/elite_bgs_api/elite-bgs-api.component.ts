import { Component, AfterViewInit } from '@angular/core';
import { ToolbarService } from './../shared/toolbar.service';
import { ToolbarButton } from './../shared/toolbar-button';

@Component({
    selector: 'ebgs-api',
    templateUrl: './elite-bgs-api.component.html',
    styleUrls: ['./elite-bgs-api.component.scss']
})
export class EliteBgsApiComponent implements AfterViewInit {
    toolbarButtons: ToolbarButton[];
    constructor(private toolbarService: ToolbarService) { }

    ngAfterViewInit() {
        this.toolbarButtons = [
            new ToolbarButton("text", "Home", "router", "/api/elitebgs"),
            new ToolbarButton("text", "Docs", "external", "https://github.com/SayakMukhopadhyay/elitebgs/wiki")
        ];

        this.toolbarService.makeButtons(this.toolbarButtons);
        this.toolbarService.setTitle('Elite BGS API');
        this.toolbarService.setShowBack(true);
    }
}
