import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSFactions, EBGSFactionSchemaDetailed, EBGSFactionsMinimal } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class FactionsService {

    constructor(private http: HttpClient) {
    }

    getFactionsBegins(page: string, name: string): Observable<EBGSFactionsMinimal> {
        return this.http.get<EBGSFactionsMinimal>('/api/ebgs/v5/factions', {
            params: new HttpParams({encoder: new CustomEncoder()}).set('page', page + 1).set('minimal', 'true').set('beginsWith', name)
        });
    }

    parseFactionDataName(factionsList: string[]): Promise<EBGSFactionSchemaDetailed[]> {
        return this.parseFactionData(factionsList, 'name');
    }

    parseFactionDataId(factionsList: string[], timeMin: Date, timeMax: Date): Promise<EBGSFactionSchemaDetailed[]> {
        return this.parseFactionData(factionsList, 'id', timeMin, timeMax);
    }

    private getHistoryById(id: string, timeMin: string, timeMax: string): Observable<EBGSFactions> {
        return this.http.get<EBGSFactions>('/api/ebgs/v5/factions', {
            params: new HttpParams().set('id', id).set('timeMin', timeMin).set('timeMax', timeMax).set('systemDetails', 'true')
        });
    }

    private getHistory(name: string, timeMin: string, timeMax: string): Observable<EBGSFactions> {
        return this.http.get<EBGSFactions>('/api/ebgs/v5/factions', {
            params: new HttpParams({encoder: new CustomEncoder()}).set('name', name).set('timeMin', timeMin).set('timeMax', timeMax).set('systemDetails', 'true')
        })
    }

    // tslint:disable-next-line:max-line-length
    private async parseFactionData(factionsList: string[], type: string, timeMin?: Date, timeMax?: Date): Promise<EBGSFactionSchemaDetailed[]> {
        const allFactionsGet: Promise<EBGSFactions>[] = [];
        const returnFactions: EBGSFactionSchemaDetailed[] = [];
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
