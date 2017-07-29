import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SystemsService {

    constructor(private http: HttpClient) { }

    getAllSystems(page: string): Observable<any> {
        return this.http.get<any>('/api/ebgs/v2/systems', {
            params: new HttpParams().set('page', page)
        });
    }
}
