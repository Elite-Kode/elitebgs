import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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
            this.idObservable = this.http.get<any>('/api/ingameids/all');
            this.idObservable.subscribe(response => {
                this.allIds = response;
            });
            return this.idObservable;
        }
    }
}
