import { Component, Input } from '@angular/core';
import { ToolbarButton } from './toolbar-button'

@Component({
    template: `<a md-button routerLink="{{button.link}}">{{button.text}}</a>`
})
export class ButtonRouterComponent {
    button: ToolbarButton;
}
