import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tick } from '../typings';
import { CustomEncoder } from './custom.encoder';
import * as moment from 'moment';

@Injectable()
export class TickService {

    constructor(
        private http: HttpClient
    ) { }

    getTick(): Observable<Tick> {
        return this.http.get<Tick>('/api/ebgs/v4/ticks');
    }

    formatTickTime(time: Tick): Tick {
        const formattedTime = <Tick>{};
        Object.keys(time).filter(key => {
            return key === 'time' || key === 'updated_at';
        }).forEach(key => {
            formattedTime[key] = moment(time[key]).utc().format('HH:mm');
        });
        return formattedTime;
    }
}
