import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ServerService {

    constructor(private http: HttpClient) { }

    getBackgroundImageFiles(): Observable<string[]> {
        return this.http.get<string[]>('/frontend/backgroundimages');
    }

    getScripts(): Observable<string[]> {
        return this.http.get<string[]>('/frontend/scripts');
    }

    putRunScript(script: string): Observable<boolean> {
        return this.http.put<boolean>('/frontend/scripts/run', { script: script });
    }
}
