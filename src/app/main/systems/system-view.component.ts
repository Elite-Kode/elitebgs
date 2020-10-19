import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ClrDatagrid } from '@clr/angular';
import { SystemsService } from '../../services/systems.service';
import { AuthenticationService } from '../../services/authentication.service';
import { IngameIdsService } from '../../services/ingameIds.service';
import { ThemeService } from '../../services/theme.service';
import { EBGSSystemSchemaDetailed, EBGSUser, IngameIdsSchema } from '../../typings';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-system-view',
    templateUrl: './system-view.component.html'
})
export class SystemViewComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-area') contentArea = true;
    @ViewChild(ClrDatagrid) datagrid: ClrDatagrid;
    isAuthenticated: boolean;
    systemData: EBGSSystemSchemaDetailed;
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
        private router: Router,
        private authenticationService: AuthenticationService,
        private titleService: Title,
        private ingameIdsService: IngameIdsService,
        private themeService: ThemeService
    ) {
    }

    ngAfterViewInit() {
        this.themeService.theme$.subscribe(() => {
            this.datagrid.resize();
        });
    }

    async ngOnInit() {
        this.checkRedirect();
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

    checkRedirect() {
        const routerParam = this.route.snapshot.paramMap.get('systemId')
        if (routerParam.startsWith('eddbId-')) {
            this.systemService.getSystemIdByEDDBId(routerParam.slice(7)).subscribe(systems => {
                this.router.navigateByUrl('/system/' + systems.docs[0]._id)
            })
        }
    }

    async getSystemData(): Promise<EBGSSystemSchemaDetailed[]> {
        return await this.systemService
            .parseSystemDataId([this.route.snapshot.paramMap.get('systemId')], this.fromDateFilter, this.toDateFilter);
    }

    updateSystem(system: EBGSSystemSchemaDetailed) {
        this.daysGap = moment(this.toDateFilter).diff(moment(this.fromDateFilter), 'days');
        this.systemData = system;
        this.systemData.government = this.FDevIDs.government[this.systemData.government].name;
        this.systemData.allegiance = this.FDevIDs.superpower[this.systemData.allegiance].name;
        this.systemData.primary_economy = this.FDevIDs.economy[this.systemData.primary_economy].name;

        this.systemData.secondary_economy = this.systemData.secondary_economy
            ? this.FDevIDs.economy[this.systemData.secondary_economy].name
            : this.systemData.secondary_economy;

        this.systemData.state = this.FDevIDs.state[this.systemData.state].name;
        this.systemData.security = this.FDevIDs.security[this.systemData.security].name;
        this.systemData.factions.forEach(faction => {
            faction.faction_details.faction_presence.state = this.FDevIDs.state[faction.faction_details.faction_presence.state].name;

            faction.faction_details.faction_presence.happiness = faction.faction_details.faction_presence.happiness
                ? this.FDevIDs.happiness[faction.faction_details.faction_presence.happiness].name
                : '';

            faction.faction_details.faction_presence.active_states = faction.faction_details.faction_presence.active_states
                ? faction.faction_details.faction_presence.active_states
                : [];

            faction.faction_details.faction_presence.active_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
            faction.faction_details.faction_presence.pending_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
            faction.faction_details.faction_presence.recovering_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
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
