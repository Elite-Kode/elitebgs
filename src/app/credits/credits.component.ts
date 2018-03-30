import { Component, HostBinding, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ServerService } from '../services/server.service';
import { EBGSCredits } from '../typings';

@Component({
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    contributers: EBGSCredits[];
    patrons: EBGSCredits[];
    constructor(
        private serverService: ServerService,
        private titleService: Title
    ) {
        this.titleService.setTitle('Credits - Elite BGS');
        this.contributers = [];
        this.patrons = [];
    }

    ngOnInit(): void {
        this.serverService.getCredits().subscribe(credits => {
            credits.forEach(credit => {
                if (credit.os_contribution > 0) {
                    this.contributers.push(credit);
                }
                if (credit.level > 1) {
                    this.patrons.push(credit);
                }
            })
        });
    }
}
