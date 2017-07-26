import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ISystem } from '../system.interface';

@Injectable()
export class SystemsService {

    constructor(private http: Http) { }

    getAllSystems(): Observable<ISystem[]> {
        return this.http.get('/api/ebgs/v1/systems')
            .map(res => {
                return res.json().map(responseSystem => {
                    return <ISystem>{
                        name: responseSystem.name,
                        government: responseSystem.government,
                        allegiance: responseSystem.allegiance,
                        primary_economy: responseSystem.primary_economy,
                        state: responseSystem.state,
                        controlling_minor_faction: responseSystem.controlling_minor_faction
                    };
                });
            });
    }
}
