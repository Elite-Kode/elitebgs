import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FactionsService {

    constructor(private http: HttpClient) { }

    getFactions(page: string, name: string): Observable<any> {
        return this.http.get<any>('/api/ebgs/v3/factions', {
            params: new HttpParams().set('page', page).set('beginsWith', name)
        });
    }

    getSingleFactionById(id: string): Observable<any> {
        return this.http.get<any>('/api/ebgs/v3/factions', {
            params: new HttpParams().set('id', id)
        });
    }
}
