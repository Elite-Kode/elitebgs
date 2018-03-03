import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
    themes = [
        { name: 'light', href: '/styles/clr-ui.min.css' },
        { name: 'dark', href: '/styles/clr-ui-dark.min.css' }
    ];
    theme = this.themes[0];

    getTheme() {
        try {
            const stored = localStorage.getItem('theme');
            if (stored) {
                this.theme = JSON.parse(stored);
                return this.theme;
            } else {
                return this.themes[0];
            }
        } catch (err) {
            return this.themes[0];
        }
    }

    setTheme(name: String) {
        this.theme = this.themes[this.themes.findIndex(theme => {
            return name === theme.name;
        })];
        localStorage.setItem('theme', JSON.stringify(this.theme));
    }
}
