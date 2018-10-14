import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSDonor, EBGSPatron, EBGSCredits, EBGSUsers, EBGSUser } from '../typings';
import { CustomEncoder } from './custom.encoder';


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

    getUsersBegins(page: string, user: string): Observable<EBGSUsers> {
        return this.http.get<EBGSUsers>('/frontend/users', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('page', page).set('beginsWith', user)
        });
    }

    getUsers(id: string): Observable<EBGSUsers> {
        return this.http.get<EBGSUsers>('/frontend/users', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('id', id)
        });
    }

    putUser(user: EBGSUser): Observable<boolean> {
        return this.http.put<boolean>('/frontend/users', user);
    }

    getScripts(): Observable<string[]> {
        return this.http.get<string[]>('/frontend/scripts');
    }

    putRunScript(script: string): Observable<boolean> {
        return this.http.put<boolean>('/frontend/scripts/run', { script: script });
    }
}
