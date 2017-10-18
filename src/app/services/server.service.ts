import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ServerService {

    constructor(private http: HttpClient) { }

    getBackgroundImageFiles(): Observable<string[]> {
        return this.http.get<string[]>('/frontend/backgroundimages');
    }

    postEdit(data): Observable<boolean> {
        return this.http.post<boolean>('/frontend/edit', data);
    }
}
