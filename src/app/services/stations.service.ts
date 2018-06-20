import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSStationsV4WOHistory, EBGSStationsV4, EBGSStationV4Schema } from '../typings';
// import { FactionsService } from './factions.service';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class StationsService {

    constructor(
        private http: HttpClient,
        // private factionsService: FactionsService
    ) { }

    getStationsBegins(page: string, name: string): Observable<EBGSStationsV4WOHistory> {
        return this.http.get<EBGSStationsV4WOHistory>('/frontend/stations', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('page', page).set('beginsWith', name)
        });
    }

    getStations(name: string): Observable<EBGSStationsV4WOHistory> {
        return this.http.get<EBGSStationsV4WOHistory>('/frontend/stations', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name)
        });
    }

    getHistoryById(id: string, timemin: string, timemax: string): Observable<EBGSStationsV4> {
        return this.http.get<EBGSStationsV4>('/frontend/stations', {
            params: new HttpParams().set('id', id).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistory(name: string, timemin: string, timemax: string): Observable<EBGSStationsV4> {
        return this.http.get<EBGSStationsV4>('/frontend/stations', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name).set('timemin', timemin).set('timemax', timemax)
        });
    }

    parseStationDataName(systemsList: string[]): Promise<EBGSStationV4Schema[]> {
        return this.parseStationData(systemsList, 'name');
    }

    parseStationDataId(systemsList: string[]): Promise<EBGSStationV4Schema[]> {
        return this.parseStationData(systemsList, 'id');
    }

    private parseStationData(stationsList: string[], type: string): Promise<EBGSStationV4Schema[]> {
        const allStationsGet: Promise<EBGSStationsV4>[] = [];
        const returnStations: EBGSStationV4Schema[] = [];
        stationsList.forEach(station => {
            allStationsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSStationsV4>;
                if (type === 'name') {
                    history = this.getHistory(station, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString());
                }
                if (type === 'id') {
                    history = this.getHistoryById(station, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString());
                }
                history.subscribe(stations => {
                    stations.docs.forEach(gotStation => {
                        returnStations.push(gotStation);
                    });
                    resolve(stations);
                }, (err: HttpErrorResponse) => {
                    reject(err);
                });
            }));
        });
        return new Promise((resolve, reject) => {
            Promise.all(allStationsGet)
                .then(systems => {
                    resolve(returnStations);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
