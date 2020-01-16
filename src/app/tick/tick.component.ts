import { Component, HostBinding, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClrDatagrid } from '@clr/angular';
import { Tick, TickDisplay } from '../typings';
import { TickService } from 'app/services/tick.service';
import * as moment from 'moment';
import { ThemeService } from '../services/theme.service';

@Component({
    templateUrl: './tick.component.html'
})
export class TickComponent implements OnInit, AfterViewInit {
    @HostBinding('class.content-container') contentContainer = true;
    @ViewChild(ClrDatagrid, {static: false}) datagrid: ClrDatagrid;
    totalRecords = 0;
    daysGap = 0;
    loading = true;
    fromDateFilter = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    toDateFilter = new Date(Date.now());
    ticks: Tick;
    tickFormatted: TickDisplay;
    constructor(
        private tickService: TickService,
        private titleService: Title,
        private themeService: ThemeService
    ) {
        this.titleService.setTitle('Tick - Elite BGS');
    }

    ngAfterViewInit() {
        this.themeService.theme$.subscribe(() => {
            this.datagrid.resize();
        });
    }

    ngOnInit(): void {
        this.getTickData();
    }

    getTickData() {
        this.daysGap = moment(this.toDateFilter).diff(moment(this.fromDateFilter), 'days');
        this.loading = true;
        this.tickService
            .getTicks(this.fromDateFilter.getTime().toString(), this.toDateFilter.getTime().toString())
            .subscribe(ticks => {
                this.loading = false;
                this.ticks = ticks;
                this.tickFormatted = ticks.map(tick => {
                    return this.tickService.formatTickTime(tick);
                });
                this.totalRecords = ticks.length;
            });
    }

    fromDateChange(date: Date) {
        this.fromDateFilter = date;
        this.getTickData();
    }

    toDateChange(date: Date) {
        this.toDateFilter = date;
        this.getTickData();
    }
}
