import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EBGSFactionsV3, EBGSFactionsV3WOHistory } from '../typings';

@Injectable()
export class FactionsService {

    constructor(private http: HttpClient) { }

    getFactionsBegins(page: string, name: string): Observable<EBGSFactionsV3WOHistory> {
        return this.http.get<EBGSFactionsV3WOHistory>('/api/ebgs/v3/factions', {
            params: new HttpParams().set('page', page).set('beginsWith', name)
        });
    }

    getFactions(name: string): Observable<EBGSFactionsV3WOHistory> {
        return this.http.get<EBGSFactionsV3WOHistory>('/api/ebgs/v3/factions', {
            params: new HttpParams().set('name', name)
        });
    }

    getHistoryById(id: string, timemin: string, timemax: string): Observable<EBGSFactionsV3> {
        return this.http.get<EBGSFactionsV3>('/api/ebgs/v3/factions', {
            params: new HttpParams().set('id', id).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistory(name: string, timemin: string, timemax: string): Observable<EBGSFactionsV3> {
        return this.http.get<EBGSFactionsV3>('/api/ebgs/v3/factions', {
            params: new HttpParams().set('name', name).set('timemin', timemin).set('timemax', timemax)
        })
    }
}
