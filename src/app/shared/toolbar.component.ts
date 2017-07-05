import { Component, AfterViewInit } from '@angular/core';
import { ToolbarService } from './toolbar.service';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    providers: [],
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements AfterViewInit {
    title = 'Elite BGS';
    toBeShown = true;
    backLink = "/";

    constructor(private toolbarService: ToolbarService) { }

    ngAfterViewInit() {
        this.toolbarService.getTitle().subscribe((title: string) => {
            this.title = title;
        });

        this.toolbarService.getShowBack().subscribe((showBack: boolean) => {
            this.toBeShown = showBack;
        });
    }
}
