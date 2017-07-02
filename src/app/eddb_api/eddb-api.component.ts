import { Component } from '@angular/core';

@Component({
    selector: 'eddb-api',
    templateUrl: './eddb-api.component.html',
    styleUrls: ['./eddb-api.component.scss']
})
export class EddbApiComponent {
    title = 'EDDB API';
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
