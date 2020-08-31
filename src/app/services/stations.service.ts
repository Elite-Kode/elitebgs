import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EBGSStations, EBGSStationSchemaDetailed, EBGSStationsDetailed } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class StationsService {

    constructor(private http: HttpClient) {
    }

    getStationsBegins(page: string, name: string): Observable<EBGSStations> {
        return this.http.get<EBGSStations>('/api/ebgs/v5/stations', {
            params: new HttpParams({encoder: new CustomEncoder()}).set('page', page + 1).set('beginsWith', name)
        });
    }

    parseStationDataName(systemsList: string[]): Promise<EBGSStationSchemaDetailed[]> {
        return this.parseStationData(systemsList, 'name');
    }

    parseStationDataId(systemsList: string[]): Promise<EBGSStationSchemaDetailed[]> {
        return this.parseStationData(systemsList, 'id');
    }

    private getHistoryById(id: string, timeMin: string, timeMax: string): Observable<EBGSStationsDetailed> {
        return this.http.get<EBGSStationsDetailed>('/api/ebgs/v5/stations', {
            params: new HttpParams().set('id', id).set('timeMin', timeMin).set('timeMax', timeMax)
        });
    }

    private getHistory(name: string, timeMin: string, timeMax: string): Observable<EBGSStationsDetailed> {
        return this.http.get<EBGSStationsDetailed>('/api/ebgs/v5/stations', {
            params: new HttpParams({encoder: new CustomEncoder()}).set('name', name).set('timeMin', timeMin).set('timeMax', timeMax)
        });
    }

    private async parseStationData(stationsList: string[], type: string): Promise<EBGSStationSchemaDetailed[]> {
        const allStationsGet: Promise<EBGSStationsDetailed>[] = [];
        const returnStations: EBGSStationSchemaDetailed[] = [];
        stationsList.forEach(station => {
            allStationsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSStationsDetailed>;
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
