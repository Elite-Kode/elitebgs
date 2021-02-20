import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EBGSUser } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    isAuthenticated(): Observable<boolean> {
        return this.http.get<boolean>('/auth/check');
    }

    getUser(): Observable<EBGSUser> {
        return this.http.get<EBGSUser>('/auth/user')
            .pipe(map((user: EBGSUser): EBGSUser => {
                user.patronage.since = new Date(user.patronage.since);
                user.donation.forEach((donation, i) => {
                    user.donation[i].date = new Date(donation.date);
                });
                return user;
            }));
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
            params: new HttpParams({ encoder: new CustomEncoder() }).set('faction', faction)
        });
    }

    removeSystem(system: string): Observable<boolean> {
        return this.http.delete<boolean>('/auth/user/edit', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('system', system)
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
