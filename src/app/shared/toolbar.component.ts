import { Component } from '@angular/core';
import { ToolbarService } from './toolbar.service';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    providers: [],
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    title = 'Elite BGS';
    switchToTheme = 'Light';
    toBeShown = true;
    backLink = "/";

    constructor(private toolbarService: ToolbarService) { }

    onClickThemeSwitch() {
        this.toolbarService.switchTheme(this.switchToTheme);
        if (this.switchToTheme === 'Dark') {
            this.switchToTheme = 'Light';
        } else if (this.switchToTheme === 'Light') {
            this.switchToTheme = 'Dark';
        }
    }

    ngAfterViewInit() {
        this.toolbarService.getTitle().subscribe((title: string) => {
            this.title = title;
        });

        this.toolbarService.getShowBack().subscribe((showBack: boolean) => {
            this.toBeShown = showBack;
        });
    }
}
