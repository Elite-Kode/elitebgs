import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSSystemSchemaDetailed, EBGSSystemsDetailed, EBGSSystemsMinimal } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class SystemsService {

    constructor(private http: HttpClient) {
    }

    getSystemsBegins(page: string, name: string): Observable<EBGSSystemsMinimal> {
        return this.http.get<EBGSSystemsMinimal>('/api/ebgs/v5/systems', {
            params: new HttpParams({encoder: new CustomEncoder()}).set('page', page + 1).set('minimal', 'true').set('beginsWith', name)
        });
    }

    parseSystemDataName(systemsList: string[]): Promise<EBGSSystemSchemaDetailed[]> {
        return this.parseSystemData(systemsList, 'name');
    }

    parseSystemDataId(systemsList: string[], timeMin: Date, timeMax: Date): Promise<EBGSSystemSchemaDetailed[]> {
        return this.parseSystemData(systemsList, 'id', timeMin, timeMax);
    }

    private getHistoryById(id: string, timeMin: string, timeMax: string): Observable<EBGSSystemsDetailed> {
        return this.http.get<EBGSSystemsDetailed>('/api/ebgs/v5/systems', {
            params: new HttpParams().set('id', id).set('timeMin', timeMin).set('timeMax', timeMax).set('factionDetails', 'true').set('factionHistory', 'true')
        });
    }

    private getHistory(name: string, timeMin: string, timeMax: string): Observable<EBGSSystemsDetailed> {
        return this.http.get<EBGSSystemsDetailed>('/api/ebgs/v5/systems', {
            params: new HttpParams({encoder: new CustomEncoder()}).set('name', name).set('timeMin', timeMin).set('timeMax', timeMax).set('factionDetails', 'true').set('factionHistory', 'true')
        });
    }

    // tslint:disable-next-line:max-line-length
    private async parseSystemData(systemsList: string[], type: string, timeMin?: Date, timeMax?: Date): Promise<EBGSSystemSchemaDetailed[]> {
        const allSystemsGet: Promise<EBGSSystemsDetailed>[] = [];
        const returnSystems: EBGSSystemSchemaDetailed[] = [];
        if (timeMin === undefined || timeMin === null) {
            timeMin = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        }
        if (timeMax === undefined || timeMax === null) {
            timeMax = new Date(Date.now())
        }
        systemsList.forEach(system => {
            allSystemsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSSystemsDetailed>;
                if (type === 'name') {
                    history = this.getHistory(system, timeMin.getTime().toString(), timeMax.getTime().toString());
                }
                if (type === 'id') {
                    history = this.getHistoryById(system, timeMin.getTime().toString(), timeMax.getTime().toString());
                }
                history.subscribe(systems => {
                    systems.docs.forEach(gotSystem => {
                        returnSystems.push(gotSystem);
                    });
                    resolve(systems);
                }, (err: HttpErrorResponse) => {
                    reject(err);
                });
            }));
        });
        await Promise.all(allSystemsGet);
        return returnSystems;
    }
}
