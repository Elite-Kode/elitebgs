import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SystemsService } from '../../services/systems.service';
import { AuthenticationService } from '../../services/authentication.service';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSSystemChart, EBGSUser } from '../../typings';
import * as moment from 'moment';

@Component({
    selector: 'app-system-view',
    templateUrl: './system-view.component.html'
})
export class SystemViewComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    systemData: EBGSSystemChart;
    successAlertState = false;
    failureAlertState = false;
    fromDateFilter = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    toDateFilter = new Date(Date.now());
    daysGap = 0;
    user: EBGSUser;
    constructor(
        private systemService: SystemsService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private titleService: Title
    ) { }

    ngOnInit() {
        this.getAuthentication();
        this.getSystemData();
    }

    getSystemData() {
        this.daysGap = moment(this.toDateFilter).diff(moment(this.fromDateFilter), 'days');
        this.systemService
            .parseSystemDataId([this.route.snapshot.paramMap.get('systemid')], this.fromDateFilter, this.toDateFilter)
            .then(system => {
                this.systemData = system[0];
                this.systemData.government = FDevIDs.government[this.systemData.government].name;
                this.systemData.allegiance = FDevIDs.superpower[this.systemData.allegiance].name;
                this.systemData.primary_economy = FDevIDs.economy[this.systemData.primary_economy].name;
                this.systemData.state = FDevIDs.state[this.systemData.state].name;
                this.systemData.security = FDevIDs.security[this.systemData.security].name;
                this.systemData.factions.forEach(faction => {
                    faction.state = FDevIDs.state[faction.state].name;
                    faction.pending_states.forEach(state => {
                        state.state = FDevIDs.state[state.state].name;
                    });
                    faction.recovering_states.forEach(state => {
                        state.state = FDevIDs.state[state.state].name;
                    });
                    if (faction.name_lower === this.systemData.controlling_minor_faction) {
                        this.systemData.controlling_faction = faction;
                    }
                });
                this.titleService.setTitle(this.systemData.name + ' - Elite BGS');
            });
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => {
                this.isAuthenticated = status;
                if (this.isAuthenticated) {
                    this.getUser();
                } else {
                    this.user = {} as EBGSUser;
                }
            });
    }

    getUpdatedAtFormatted(updatedAt) {
        return {
            time: moment(updatedAt).utc().format('ddd, MMM D, HH:mm:ss'),
            fromNow: moment(updatedAt).fromNow(true),
            ageFlag: moment(Date.now()).diff(moment(updatedAt), 'days', true) - 1
        }
    }

    monitor() {
        this.authenticationService
            .addSystems([this.systemData.name])
            .subscribe(status => {
                if (status === true) {
                    this.successAlertState = true;
                    setTimeout(() => {
                        this.successAlertState = false;
                    }, 3000);
                } else {
                    this.failureAlertState = true;
                    setTimeout(() => {
                        this.failureAlertState = false
                    }, 3000);
                }
            });
    }

    getUser() {
        this.authenticationService
            .getUser()
            .subscribe(user => {
                this.user = user;
            });
    }

    fromDateChange(date: Date) {
        this.fromDateFilter = date;
        this.getSystemData();
    }

    toDateChange(date: Date) {
        this.toDateFilter = date;
        this.getSystemData();
    }
}
