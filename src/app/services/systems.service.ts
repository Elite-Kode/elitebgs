import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SystemsService {

    constructor(private http: HttpClient) { }

    getSystems(page: string, name: string): Observable<any> {
        return this.http.get<any>('/api/ebgs/v3/systems', {
            params: new HttpParams().set('page', page).set('beginsWith', name)
        });
    }

    getSingleSystemById(id: string): Observable<any> {
        return this.http.get<any>('/api/ebgs/v3/systems', {
            params: new HttpParams().set('id', id)
        });
    }
}
