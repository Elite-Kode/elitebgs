import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSSystemsV3, EBGSSystemsV3WOHistory, EBGSFactionV3Schema, EBGSSystemChart, EBGSSystemPostHistory, EBGSFactionPostHistory, EBGSSystemChartPaginate } from '../typings';
import { FactionsService } from './factions.service';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class SystemsService {

    constructor(
        private http: HttpClient,
        private factionsService: FactionsService
    ) { }

    getSystemsBegins(page: string, name: string): Observable<EBGSSystemsV3WOHistory> {
        return this.http.get<EBGSSystemsV3WOHistory>('/frontend/systems', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('page', page).set('beginsWith', name)
        });
    }

    getSystems(name: string): Observable<EBGSSystemsV3WOHistory> {
        return this.http.get<EBGSSystemsV3WOHistory>('/frontend/systems', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name)
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

    parseSystemDataName(systemsList: string[]): Promise<EBGSSystemChart[]> {
        return this.parseSystemData(systemsList, 'name');
    }

    parseSystemDataId(systemsList: string[]): Promise<EBGSSystemChart[]> {
        return this.parseSystemData(systemsList, 'id');
    }

    private parseSystemData(systemsList: string[], type: string): Promise<EBGSSystemChart[]> {
        const allSystemsGet: Promise<EBGSSystemChartPaginate>[] = [];
        const returnSystems: EBGSSystemChart[] = [];
        systemsList.forEach(system => {
            allSystemsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSSystemChartPaginate>;
                if (type === 'name') {
                    history = this.getHistory(system, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString());
                }
                if (type === 'id') {
                    history = this.getHistoryById(system, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString());
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
        return new Promise((resolve, reject) => {
            Promise.all(allSystemsGet)
                .then(systems => {
                    resolve(returnSystems);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
