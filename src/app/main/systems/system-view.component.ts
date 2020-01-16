import { Component, OnInit, HostBinding, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ClrDatagrid } from '@clr/angular';
import { SystemsService } from '../../services/systems.service';
import { AuthenticationService } from '../../services/authentication.service';
import { IngameIdsService } from '../../services/ingameIds.service';
import { ThemeService } from '../../services/theme.service';
import { EBGSSystemChart, EBGSUser, IngameIdsSchema } from '../../typings';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-system-view',
    templateUrl: './system-view.component.html'
})
export class SystemViewComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-area') contentArea = true;
    @ViewChild(ClrDatagrid, {static: false}) datagrid: ClrDatagrid;
    isAuthenticated: boolean;
    systemData: EBGSSystemChart;
    successAlertState = false;
    failureAlertState = false;
    fromDateFilter = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    toDateFilter = new Date(Date.now());
    dateFilterSubject = new Subject<null>();
    dateFilter$ = this.dateFilterSubject.asObservable();
    daysGap = 0;
    chartLoading = false;
    user: EBGSUser;
    FDevIDs: IngameIdsSchema;
    constructor(
        private systemService: SystemsService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private titleService: Title,
        private ingameIdsService: IngameIdsService,
        private themeService: ThemeService
    ) { }

    ngAfterViewInit() {
        this.themeService.theme$.subscribe(() => {
            this.datagrid.resize();
        });
    }

    async ngOnInit() {
        this.getAuthentication();
        this.FDevIDs = await this.ingameIdsService.getAllIds().toPromise();
        this.chartLoading = true;
        this.updateSystem((await this.getSystemData())[0]);
        this.chartLoading = false;
        this.dateFilter$
            .pipe(debounceTime(300))
            .pipe(switchMap(() => {
                this.chartLoading = true;
                return this.getSystemData();
            }))
            .subscribe(system => {
                this.updateSystem(system[0]);
                this.chartLoading = false;
            });
    }

    async getSystemData(): Promise<EBGSSystemChart[]> {
        return await this.systemService
            .parseSystemDataId([this.route.snapshot.paramMap.get('systemid')], this.fromDateFilter, this.toDateFilter);
    }

    updateSystem(system: EBGSSystemChart) {
        this.daysGap = moment(this.toDateFilter).diff(moment(this.fromDateFilter), 'days');
        this.systemData = system;
        this.systemData.government = this.FDevIDs.government[this.systemData.government].name;
        this.systemData.allegiance = this.FDevIDs.superpower[this.systemData.allegiance].name;
        this.systemData.primary_economy = this.FDevIDs.economy[this.systemData.primary_economy].name;
        this.systemData.secondary_economy = this.systemData.secondary_economy ? this.FDevIDs.economy[this.systemData.secondary_economy].name : this.systemData.secondary_economy;
        this.systemData.state = this.FDevIDs.state[this.systemData.state].name;
        this.systemData.security = this.FDevIDs.security[this.systemData.security].name;
        this.systemData.factions.forEach(faction => {
            faction.state = this.FDevIDs.state[faction.state].name;
            faction.happiness = faction.happiness ? this.FDevIDs.happiness[faction.happiness].name : '';
            faction.active_states = faction.active_states ? faction.active_states : [];
            faction.active_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
            faction.pending_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
            faction.recovering_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
            if (faction.name_lower === this.systemData.controlling_minor_faction) {
                this.systemData.controlling_faction = faction;
            }
        });
        this.titleService.setTitle(this.systemData.name + ' - Elite BGS');
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
        this.dateFilterSubject.next();
    }

    toDateChange(date: Date) {
        this.toDateFilter = date;
        this.dateFilterSubject.next();
    }
}
