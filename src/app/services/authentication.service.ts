import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSUser } from '../typings';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    isAuthenticated(): Observable<boolean> {
        return this.http.get<boolean>('/auth/check');
    }

    isEditAllowed(systemName: string): Observable<boolean> {
        return this.http.get<boolean>('/auth/check/edit', {
            params: new HttpParams().set('name', systemName)
        });
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

    addStations(stations: string[]): Observable<boolean> {
        return this.http.post<boolean>('/auth/user/edit', { stations: stations.join() });
    }

    removeFaction(faction: string): Observable<boolean> {
        return this.http.delete<boolean>('/auth/user/edit', {
            params: new HttpParams().set('faction', faction)
        });
    }

    removeSystem(system: string): Observable<boolean> {
        return this.http.delete<boolean>('/auth/user/edit', {
            params: new HttpParams().set('system', system)
        });
    }

    removeEditableFaction(faction: string): Observable<boolean> {
        return this.http.delete<boolean>('/auth/user/edit', {
            params: new HttpParams().set('editablefaction', faction)
        });
    }

    removeUser(id: string): Observable<boolean> {
        return this.http.delete<boolean>('/auth/user/delete', {
            params: new HttpParams().set('userid', id)
        });
    }

    putUser(user: EBGSUser): Observable<boolean> {
        return this.http.put<boolean>('/frontend/users', user);
    }
}
