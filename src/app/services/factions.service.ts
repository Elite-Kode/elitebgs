import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSFactions, EBGSFactionsWOHistory, EBGSFactionSchema } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class FactionsService {

    constructor(private http: HttpClient) { }

    getFactionsBegins(page: string, name: string): Observable<EBGSFactionsWOHistory> {
        return this.http.get<EBGSFactionsWOHistory>('/frontend/factions', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('page', page).set('beginsWith', name)
        });
    }

    getFactions(name: string): Observable<EBGSFactionsWOHistory> {
        return this.http.get<EBGSFactionsWOHistory>('/frontend/factions', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name)
        });
    }

    getHistoryById(id: string, timemin: string, timemax: string): Observable<EBGSFactions> {
        return this.http.get<EBGSFactions>('/frontend/factions', {
            params: new HttpParams().set('id', id).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistory(name: string, timemin: string, timemax: string): Observable<EBGSFactions> {
        return this.http.get<EBGSFactions>('/frontend/factions', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name).set('timemin', timemin).set('timemax', timemax)
        })
    }

    parseFactionDataName(factionsList: string[]): Promise<EBGSFactionSchema[]> {
        return this.parseFactionData(factionsList, 'name');
    }

    parseFactionDataId(factionsList: string[], timeMin: Date, timeMax: Date): Promise<EBGSFactionSchema[]> {
        return this.parseFactionData(factionsList, 'id', timeMin, timeMax);
    }

    private async parseFactionData(factionsList: string[], type: string, timeMin?: Date, timeMax?: Date): Promise<EBGSFactionSchema[]> {
        const allFactionsGet: Promise<EBGSFactions>[] = [];
        const returnFactions: EBGSFactionSchema[] = [];
        if (timeMin === undefined || timeMin === null) {
            timeMin = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        }
        if (timeMax === undefined || timeMax === null) {
            timeMax = new Date(Date.now())
        }
        factionsList.forEach(faction => {
            allFactionsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSFactions>;
                if (type === 'name') {
                    history = this.getHistory(faction, timeMin.getTime().toString(), timeMax.getTime().toString());
                }
                if (type === 'id') {
                    history = this.getHistoryById(faction, timeMin.getTime().toString(), timeMax.getTime().toString())
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
        await Promise.all(allFactionsGet);
        return returnFactions;
    }
}
