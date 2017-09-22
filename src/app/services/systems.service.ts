import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EBGSSystemsV3, EBGSSystemsV3WOHistory } from '../typings';

@Injectable()
export class SystemsService {

    constructor(private http: HttpClient) { }

    getSystemsBegins(page: string, name: string): Observable<EBGSSystemsV3WOHistory> {
        return this.http.get<EBGSSystemsV3WOHistory>('/api/ebgs/v3/systems', {
            params: new HttpParams().set('page', page).set('beginsWith', name)
        });
    }

    getSystems(name: string): Observable<EBGSSystemsV3WOHistory> {
        return this.http.get<EBGSSystemsV3WOHistory>('/api/ebgs/v3/systems', {
            params: new HttpParams().set('name', name)
        });
    }

    getHistoryById(id: string, timemin: string, timemax: string): Observable<EBGSSystemsV3> {
        return this.http.get<EBGSSystemsV3>('/api/ebgs/v3/systems', {
            params: new HttpParams().set('id', id).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistory(name: string, timemin: string, timemax: string): Observable<EBGSSystemsV3> {
        return this.http.get<EBGSSystemsV3>('/api/ebgs/v3/systems', {
            params: new HttpParams().set('name', name).set('timemin', timemin).set('timemax', timemax)
        })
    }
}
