import { Component, OnInit } from '@angular/core';
import { ToolbarService } from './shared/toolbar.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: []
})
export class AppComponent implements OnInit {
    isDarkTheme = true;
    isLightTheme = false;

    constructor(private toolbarService: ToolbarService) { }

    ngOnInit() {
        this.toolbarService.getTheme().subscribe((currentTheme: string) => {
            if (currentTheme === "Dark") {
                this.isDarkTheme = true;
                this.isLightTheme = false;
            } else if (currentTheme === "Light") {
                this.isDarkTheme = false;
                this.isLightTheme = true;
            }
        });
    }
}
