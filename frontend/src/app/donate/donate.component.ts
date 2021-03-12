import { Component, HostBinding, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EBGSDonor, EBGSPatron } from '../typings';
import { UsersService } from 'app/services/users.service';

@Component({
    templateUrl: './donate.component.html',
    styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    donors: EBGSDonor[];
    patrons: EBGSPatron[];
    constructor(
        private usersService: UsersService,
        private titleService: Title
    ) {
        this.titleService.setTitle('Donate - Elite BGS');
        this.donors = [];
        this.patrons = [];
    }

    ngOnInit(): void {
        this.usersService.getDonors().subscribe(donors => {
            this.donors = donors;
        });
        this.usersService.getPatrons().subscribe(patrons => {
            this.patrons = patrons;
        });
    }
}
