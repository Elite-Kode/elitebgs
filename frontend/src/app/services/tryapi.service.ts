import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TryAPIService {

    constructor(
        private http: HttpClient
    ) { }

    getAPIResponse(url: string): Observable<any> {
        return this.http.get<any>(url);
    }
}
