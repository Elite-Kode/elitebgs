import { Component, OnInit, AfterViewInit, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FactionsService } from '../../services/factions.service';
import { AuthenticationService } from '../../services/authentication.service';
import { IngameIdsService } from '../../services/ingameIds.service';
import { ThemeService } from '../../services/theme.service';
import { StringHandlers } from '../../utilities/stringHandlers';
import { EBGSFactionSchema, EBGSUser, IngameIdsSchema } from '../../typings';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ClrDatagrid } from '@clr/angular';

@Component({
    selector: 'app-faction-view',
    templateUrl: './faction-view.component.html'
})
export class FactionViewComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-area') contentArea = true;
    @ViewChild(ClrDatagrid, {static: false}) datagrid: ClrDatagrid;
    isAuthenticated: boolean;
    factionData: EBGSFactionSchema;
    systemsPresence: number;
    systemsControlled: number;
    conflicts: EBGSFactionSchema['faction_presence'][0]['conflicts'][] = [];
    successAlertState = false;
    failureAlertState = false;
    fromDateFilter = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    toDateFilter = new Date(Date.now());
    dateFilterSubject = new Subject<any>();
    dateFilter$ = this.dateFilterSubject.asObservable();
    daysGap = 0;
    chartLoading = false;
    user: EBGSUser;
    FDevIDs: IngameIdsSchema;
    constructor(
        private factionService: FactionsService,
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
        this.updateFaction((await this.getFactionData())[0]);
        this.chartLoading = false;
        this.dateFilter$
            .pipe(debounceTime(300))
            .pipe(switchMap(() => {
                this.chartLoading = true;
                return this.getFactionData();
            }))
            .subscribe(faction => {
                this.updateFaction(faction[0]);
                this.chartLoading = false;
            });
    }

    async getFactionData(): Promise<EBGSFactionSchema[]> {
        return await this.factionService
            .parseFactionDataId([this.route.snapshot.paramMap.get('factionid')], this.fromDateFilter, this.toDateFilter);
    }

    updateFaction(faction: EBGSFactionSchema) {
        this.daysGap = moment(this.toDateFilter).diff(moment(this.fromDateFilter), 'days');
        this.factionData = faction;
        this.factionData.government = StringHandlers.titlify(this.factionData.government);
        this.factionData.allegiance = StringHandlers.titlify(this.factionData.allegiance);
        this.factionData.faction_presence.forEach(system => {
            system.state = this.FDevIDs.state[system.state].name;
            system.happiness = system.happiness ? this.FDevIDs.happiness[system.happiness].name : '';
            system.active_states = system.active_states ? system.active_states : [];
            system.active_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
            system.pending_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
            system.recovering_states.forEach(state => {
                state.state = this.FDevIDs.state[state.state].name;
            });
            if (system.conflicts) {
                system.conflicts.forEach(conflict => {
                    conflict.system_id = system.system_id;
                    conflict.system_name = system.system_name;
                });
            }
        });
        this.conflicts = this.factionData.faction_presence.reduce((acc, system) => {
            return acc.concat(system.conflicts);
        }, [] as EBGSFactionSchema['faction_presence'][0]['conflicts'][]);
        this.systemsPresence = this.factionData.faction_presence.length;
        this.systemsControlled = this.factionData.faction_presence.reduce((count, system) => {
            if (system.controlling) {
                return count + 1;
            } else {
                return count;
            }
        }, 0);
        this.titleService.setTitle(this.factionData.name + ' - Elite BGS');
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
            .addFactions([this.factionData.name])
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
