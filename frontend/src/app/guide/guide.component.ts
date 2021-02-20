import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.scss']
})
export class GuideComponent {
    @HostBinding('class.content-container') contentContainer = true;
    constructor(private titleService: Title) {
        this.titleService.setTitle('Guide - Elite BGS');
    }
}
