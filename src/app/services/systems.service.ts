import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ISystem } from '../system.interface';
import { FDevIDs } from '../fdevids';

@Injectable()
export class SystemsService {

    constructor(private http: Http) { }

    getAllSystems(): Observable<ISystem[]> {
        return this.http.get('/api/ebgs/v1/systems')
            .map(res => {
                return res.json().map(responseSystem => {
                    const name = responseSystem.name;
                    const government = FDevIDs.government[responseSystem.government].name;
                    const allegiance = FDevIDs.superpower[responseSystem.allegiance].name;
                    const primary_economy = FDevIDs.economy[responseSystem.primary_economy].name;
                    const state = FDevIDs.state[responseSystem.state].name;
                    return <ISystem>{
                        name: name,
                        government: government,
                        allegiance: allegiance,
                        primary_economy: primary_economy,
                        state: state
                    };
                });
            });
    }
}
