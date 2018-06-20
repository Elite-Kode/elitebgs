import { Injectable } from '@angular/core';
import { HighchartsDarkTheme, HighchartsLightTheme } from './highChartsTheme';
import { BehaviorSubject } from 'rxjs';
import { Highcharts } from 'angular-highcharts';
import cloneDeep from 'lodash-es/cloneDeep'

@Injectable()
export class ThemeService {
    themes = [
        { name: 'light', href: '/styles/clr-ui.min.css', highcharts: HighchartsLightTheme },
        { name: 'dark', href: '/styles/clr-ui-dark.min.css', highcharts: HighchartsDarkTheme }
    ];
    defaultHighchartsTheme;
    theme = this.themes[0];
    themeSource = new BehaviorSubject<any>(this.theme);
    theme$ = this.themeSource.asObservable();

    constructor() {
        this.defaultHighchartsTheme = cloneDeep(Highcharts.getOptions());
        try {
            const stored = localStorage.getItem('theme');
            if (stored) {
                this.theme = JSON.parse(stored);
            } else {
                this.theme = this.themes[0];
            }
        } catch (err) {
            this.theme = this.themes[0];
        }
        this.setHighchartTheme();
    }

    getTheme() {
        return this.theme;
    }

    setTheme(name: String) {
        this.theme = this.themes[this.themes.findIndex(theme => {
            return name === theme.name;
        })];
        this.setHighchartTheme();
        localStorage.setItem('theme', JSON.stringify(this.theme));
    }

    private setHighchartTheme() {
        const currentOptions = Highcharts.getOptions();
        for (const property in currentOptions) {
            if (typeof currentOptions[property] !== 'function') {
                delete currentOptions[property]
            }
        }
        Highcharts.setOptions(this.defaultHighchartsTheme);
        Highcharts.setOptions(this.theme.highcharts as any);
    }

    themeLoaded() {
        this.themeSource.next(this.theme);
    }
}
