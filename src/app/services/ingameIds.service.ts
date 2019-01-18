import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Tick, TickSchema, TickDisplaySchema } from '../typings';
import { CustomEncoder } from './custom.encoder';
import * as moment from 'moment';

@Injectable()
export class IngameIdsService {
    private allIds: any;
    private idObservable: Observable<any>;

    constructor(
        private http: HttpClient
    ) { }

    getAllIds(): Observable<any> {
        if (this.allIds) {
            return of(this.allIds);
        } else if (this.idObservable) {
            return this.idObservable;
        } else {
            this.idObservable = this.http.get<any>('/ingameids/all');
            this.idObservable.subscribe(response => {
                this.allIds = response;
            });
            return this.idObservable;
        }
    }
}
