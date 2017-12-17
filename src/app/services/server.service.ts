import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EBGSDonor, EBGSPatron, EBGSCredits } from '../typings';


@Injectable()
export class ServerService {

    constructor(private http: HttpClient) { }

    getBackgroundImageFiles(): Observable<string[]> {
        return this.http.get<string[]>('/frontend/backgroundimages');
    }

    postEdit(data): Observable<boolean> {
        return this.http.post<boolean>('/frontend/edit', data);
    }

    getDonors(): Observable<EBGSDonor[]> {
        return this.http.get<EBGSDonor[]>('/frontend/donors');
    }

    getPatrons(): Observable<EBGSPatron[]> {
        return this.http.get<EBGSPatron[]>('/frontend/patrons');
    }

    getCredits(): Observable<EBGSCredits[]> {
        return this.http.get<EBGSCredits[]>('/frontend/credits');
    }
}
