import { Component, Input } from '@angular/core';
import { ToolbarButton } from './toolbar-button'

@Component({
    template: `<a md-button href="{{button.link}}">{{button.text}}</a>`
})
export class ButtonExternalComponent {
    button: ToolbarButton;
}
