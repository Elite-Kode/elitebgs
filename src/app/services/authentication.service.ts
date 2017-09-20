import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EBGSUser } from '../typings';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    isAuthenticated(): Observable<boolean> {
        return this.http.get<boolean>('/auth/check');
    }

    getUser(): Observable<EBGSUser> {
        return this.http.get<EBGSUser>('/auth/user');
    }

    addFactions(factions: string[]): Observable<boolean> {
        return this.http.post<boolean>('/auth/user/edit', { factions: factions.join() });
    }

    addSystems(systems: string[]): Observable<boolean> {
        return this.http.post<boolean>('/auth/user/edit', { systems: systems.join() });
    }
}
