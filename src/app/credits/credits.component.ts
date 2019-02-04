import { Component, HostBinding, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EBGSCredits } from '../typings';
import { UsersService } from 'app/services/users.service';

@Component({
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    contributers: EBGSCredits[];
    patrons: EBGSCredits[];
    constructor(
        private usersService: UsersService,
        private titleService: Title
    ) {
        this.titleService.setTitle('Credits - Elite BGS');
        this.contributers = [];
        this.patrons = [];
    }

    ngOnInit(): void {
        this.usersService.getCredits().subscribe(credits => {
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
