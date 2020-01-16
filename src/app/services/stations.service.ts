import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSStationsWOHistory, EBGSStations, EBGSStationSchema, EBGSStationHistory, EBGSStationSchemaWOHistory } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class StationsService {

    constructor(private http: HttpClient) { }

    getStationsBegins(page: string, name: string): Observable<EBGSStationsWOHistory> {
        return this.http.get<EBGSStationsWOHistory>('/frontend/stations', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('page', page + 1).set('beginsWith', name)
        });
    }

    getStations(name: string): Observable<EBGSStationsWOHistory> {
        return this.http.get<EBGSStationsWOHistory>('/frontend/stations', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name)
        });
    }

    getStationsById(id: string): Observable<EBGSStationsWOHistory> {
        return this.http.get<EBGSStationsWOHistory>('/frontend/stations', {
            params: new HttpParams().set('id', id)
        });
    }

    getHistoryById(id: string, timemin: string, timemax: string): Observable<EBGSStations> {
        return this.http.get<EBGSStations>('/frontend/stations', {
            params: new HttpParams().set('id', id).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistory(name: string, timemin: string, timemax: string): Observable<EBGSStations> {
        return this.http.get<EBGSStations>('/frontend/stations', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistoryAdmin(page: string, id: string): Observable<EBGSStationHistory> {
        return this.http.get<EBGSStationHistory>('/frontend/stationhistoryadmin', {
            params: new HttpParams().set('id', id).set('page', page + 1)
        });
    }

    putStationAdmin(station: EBGSStationSchemaWOHistory): Observable<boolean> {
        return this.http.put<boolean>('/frontend/stationadmin', station);
    }

    putStationHistoryAdmin(record: EBGSStationSchema['history']): Observable<boolean> {
        return this.http.put<boolean>('/frontend/stationhistoryadmin', record);
    }

    parseStationDataName(systemsList: string[]): Promise<EBGSStationSchema[]> {
        return this.parseStationData(systemsList, 'name');
    }

    parseStationDataId(systemsList: string[]): Promise<EBGSStationSchema[]> {
        return this.parseStationData(systemsList, 'id');
    }

    private async parseStationData(stationsList: string[], type: string): Promise<EBGSStationSchema[]> {
        const allStationsGet: Promise<EBGSStations>[] = [];
        const returnStations: EBGSStationSchema[] = [];
        stationsList.forEach(station => {
            allStationsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSStations>;
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
        await Promise.all(allStationsGet);
        return returnStations;
    }
}
