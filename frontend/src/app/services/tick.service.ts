import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tick, TickSchema, TickDisplaySchema } from '../typings';
import { CustomEncoder } from './custom.encoder';
import * as moment from 'moment';

@Injectable()
export class TickService {

    constructor(
        private http: HttpClient
    ) { }

    getTick(): Observable<Tick> {
        return this.http.get<Tick>('/api/ebgs/v5/ticks');
    }

    getTicks(timemin: string, timemax: string): Observable<Tick> {
        return this.http.get<Tick>('/api/ebgs/v5/ticks', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('timeMin', timemin).set('timeMax', timemax)
        });
    }

    formatTickTime(time: TickSchema): TickDisplaySchema {
        return {
            _id: time._id,
            time: moment(time.time).utc().format('HH:mm'),
            timeLocal: moment(time.time).format('HH:mm'),
            updated_at: moment(time.updated_at).utc().format('ddd, MMM D, HH:mm:ss')
        };
    }
}
