import { Component, HostBinding, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TickV4, TickDisplayV4 } from '../typings';
import { TickService } from 'app/services/tick.service';
import * as moment from 'moment';
import { ClrDatagridStateInterface } from '@clr/angular';

@Component({
    templateUrl: './tick.component.html'
})
export class TickComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    totalRecords = 0;
    daysGap = 0;
    loading = true;
    fromDateFilter = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    toDateFilter = new Date(Date.now());
    ticks: TickV4;
    tickFormatted: TickDisplayV4;
    constructor(
        private tickService: TickService,
        private titleService: Title
    ) {
        this.titleService.setTitle('Tick - Elite BGS');
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
