import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GalacticTick, SystemTick } from '../typings';
// import { FactionsService } from './factions.service';
import { CustomEncoder } from './custom.encoder';
import * as moment from 'moment';

@Injectable()
export class TickService {

    constructor(
        private http: HttpClient
    ) { }

    getGalacticTick(): Observable<GalacticTick> {
        return this.http.get<GalacticTick>('/api/ebgs/v4/tick');
    }

    getSystemTick(name: string): Observable<SystemTick> {
        return this.http.get<SystemTick>('/api/ebgs/v4/tick', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('system', name)
        });
    }

    formatTickTime<T>(time: T): T {
        const formattedTime = <T>{};
        Object.keys(time).reduce((previous, current) => {
            previous[current] = moment(time[current]).format('HH:mm');
            return previous;
        }, formattedTime);
        return formattedTime;
    }

    getUpdateTimeFromTick<T>(time: T): T {
        const formattedTime = <T>{};
        Object.keys(time).reduce((previous, current) => {
            previous[current] = moment(time[current]).format('dddd, MMMM Do YYYY');
            return previous;
        }, formattedTime);
        return formattedTime;
    }
}
