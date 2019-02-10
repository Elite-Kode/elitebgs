import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSSystemsWOHistory, EBGSSystemChart, EBGSSystemChartPaginate, EBGSSystemSchemaWOHistory, EBGSSystemSchema, EBGSSystemHistory } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class SystemsService {

    constructor(private http: HttpClient) { }

    getSystemsBegins(page: string, name: string): Observable<EBGSSystemsWOHistory> {
        return this.http.get<EBGSSystemsWOHistory>('/frontend/systems', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('page', page).set('beginsWith', name)
        });
    }

    getSystems(name: string): Observable<EBGSSystemsWOHistory> {
        return this.http.get<EBGSSystemsWOHistory>('/frontend/systems', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name)
        });
    }

    getSystemsById(id: string): Observable<EBGSSystemsWOHistory> {
        return this.http.get<EBGSSystemsWOHistory>('/frontend/systems', {
            params: new HttpParams().set('id', id)
        });
    }

    getHistoryById(id: string, timemin: string, timemax: string): Observable<EBGSSystemChartPaginate> {
        return this.http.get<EBGSSystemChartPaginate>('/frontend/systems', {
            params: new HttpParams().set('id', id).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistory(name: string, timemin: string, timemax: string): Observable<EBGSSystemChartPaginate> {
        return this.http.get<EBGSSystemChartPaginate>('/frontend/systems', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistoryAdmin(page: string, id: string): Observable<EBGSSystemHistory> {
        return this.http.get<EBGSSystemHistory>('/frontend/systemhistoryadmin', {
            params: new HttpParams().set('id', id).set('page', page)
        });
    }

    putSystemAdmin(system: EBGSSystemSchemaWOHistory): Observable<boolean> {
        return this.http.put<boolean>('/frontend/systemadmin', system);
    }

    putSystemHistoryAdmin(record: EBGSSystemSchema['history']): Observable<boolean> {
        return this.http.put<boolean>('/frontend/systemhistoryadmin', record);
    }

    parseSystemDataName(systemsList: string[]): Promise<EBGSSystemChart[]> {
        return this.parseSystemData(systemsList, 'name');
    }

    parseSystemDataId(systemsList: string[], timeMin: Date, timeMax: Date): Promise<EBGSSystemChart[]> {
        return this.parseSystemData(systemsList, 'id', timeMin, timeMax);
    }

    private async parseSystemData(systemsList: string[], type: string, timeMin?: Date, timeMax?: Date): Promise<EBGSSystemChart[]> {
        const allSystemsGet: Promise<EBGSSystemChartPaginate>[] = [];
        const returnSystems: EBGSSystemChart[] = [];
        if (timeMin === undefined || timeMin === null) {
            timeMin = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        }
        if (timeMax === undefined || timeMax === null) {
            timeMax = new Date(Date.now())
        }
        systemsList.forEach(system => {
            allSystemsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSSystemChartPaginate>;
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
