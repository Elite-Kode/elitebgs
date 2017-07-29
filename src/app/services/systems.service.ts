import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SystemsService {

    constructor(private http: HttpClient) { }

    getAllSystems(): Observable<any[]> {
        return this.http.get<any[]>('/api/ebgs/v1/systems');
    }
}
