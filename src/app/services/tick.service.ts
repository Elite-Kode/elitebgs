import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TickV4, TickSchema, TickDisplaySchema } from '../typings';
import { CustomEncoder } from './custom.encoder';
import * as moment from 'moment';

@Injectable()
export class TickService {

    constructor(
        private http: HttpClient
    ) { }

    getTick(): Observable<TickV4> {
        return this.http.get<TickV4>('/api/ebgs/v4/ticks');
    }

    getTicks(timemin: string, timemax: string): Observable<TickV4> {
        return this.http.get<TickV4>('/api/ebgs/v4/ticks', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('timemin', timemin).set('timemax', timemax)
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
