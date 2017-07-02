import { Component } from '@angular/core';

@Component({
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent {
    title = 'EDDB API Docs';
    isLightTheme = true;
    isDarkTheme = false;
    switchTheme = 'Dark';

    onClickThemeSwitch() {
        if (this.isLightTheme) {
            this.isLightTheme = false;
            this.isDarkTheme = true;
            this.switchTheme = 'Light';
        } else if (this.isDarkTheme) {
            this.isLightTheme = true;
            this.isDarkTheme = false;
            this.switchTheme = 'Dark';
        }
    }
}
