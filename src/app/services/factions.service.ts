import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EBGSFactionsV3, EBGSFactionsV3WOHistory, EBGSFactionV3Schema } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class FactionsService {

    constructor(private http: HttpClient) { }

    getFactionsBegins(page: string, name: string): Observable<EBGSFactionsV3WOHistory> {
        return this.http.get<EBGSFactionsV3WOHistory>('/api/ebgs/v3/factions', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('page', page).set('beginsWith', name)
        });
    }

    getFactions(name: string): Observable<EBGSFactionsV3WOHistory> {
        return this.http.get<EBGSFactionsV3WOHistory>('/api/ebgs/v3/factions', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name)
        });
    }

    getHistoryById(id: string, timemin: string, timemax: string): Observable<EBGSFactionsV3> {
        return this.http.get<EBGSFactionsV3>('/api/ebgs/v3/factions', {
            params: new HttpParams().set('id', id).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistory(name: string, timemin: string, timemax: string): Observable<EBGSFactionsV3> {
        return this.http.get<EBGSFactionsV3>('/api/ebgs/v3/factions', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name).set('timemin', timemin).set('timemax', timemax)
        })
    }

    parseFactionDataName(factionsList: string[]): Promise<EBGSFactionV3Schema[]> {
        return this.parseFactionData(factionsList, 'name');
    }

    parseFactionDataId(factionsList: string[]): Promise<EBGSFactionV3Schema[]> {
        return this.parseFactionData(factionsList, 'id');
    }

    private parseFactionData(factionsList: string[], type: string): Promise<EBGSFactionV3Schema[]> {
        const allFactionsGet: Promise<EBGSFactionsV3>[] = [];
        const returnFactions: EBGSFactionV3Schema[] = [];
        factionsList.forEach(faction => {
            allFactionsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSFactionsV3>;
                if (type === 'name') {
                    history = this.getHistory(faction, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString());
                }
                if (type === 'id') {
                    history = this.getHistoryById(faction, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString())
                }
                history.subscribe(factions => {
                    factions.docs.forEach(gotFaction => {
                        returnFactions.push(gotFaction);
                    });
                    resolve(factions);
                }, (err: HttpErrorResponse) => {
                    reject(err);
                });
            }));
        });
        return new Promise((resolve, reject) => {
            Promise.all(allFactionsGet)
                .then(factions => {
                    resolve(returnFactions);
                })
                .catch(err => {
                    reject(err);
                });
        })
    }
}
