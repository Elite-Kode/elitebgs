import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EBGSSystemsV3, EBGSSystemsV3WOHistory, EBGSFactionV3Schema, EBGSSystemChart, EBGSSystemPostHistory } from '../typings';
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

    getHistoryById(id: string, timemin: string, timemax: string): Observable<EBGSSystemsV3> {
        return this.http.get<EBGSSystemsV3>('/frontend/systems', {
            params: new HttpParams().set('id', id).set('timemin', timemin).set('timemax', timemax)
        });
    }

    getHistory(name: string, timemin: string, timemax: string): Observable<EBGSSystemsV3> {
        return this.http.get<EBGSSystemsV3>('/frontend/systems', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('name', name).set('timemin', timemin).set('timemax', timemax)
        })
    }

    parseSystemDataName(systemsList: string[]): Promise<EBGSSystemChart[]> {
        return this.parseSystemData(systemsList, 'name');
    }

    parseSystemDataId(systemsList: string[]): Promise<EBGSSystemChart[]> {
        return this.parseSystemData(systemsList, 'id');
    }

    private parseSystemData(systemsList: string[], type: string): Promise<EBGSSystemChart[]> {
        const allSystemsGet: Promise<EBGSSystemChart[]>[] = [];
        const returnSystems: EBGSSystemChart[] = [];
        systemsList.forEach(system => {
            allSystemsGet.push(new Promise((resolve, reject) => {
                let history: Observable<EBGSSystemsV3>;
                if (type === 'name') {
                    history = this.getHistory(system, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString());
                }
                if (type === 'id') {
                    history = this.getHistoryById(system, (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(), Date.now().toString())
                }
                history.subscribe(systems => {     // Stores search results of each monitored system
                    const systemPromises: Promise<EBGSSystemChart>[] = [];
                    systems.docs.forEach(gotSystem => {     // Each result might have multiple docs
                        systemPromises.push(new Promise((resolveSystem, rejectSystem) => {
                            const gotSystemChart: EBGSSystemChart = gotSystem as EBGSSystemChart;
                            const allFactionsGet: Promise<EBGSFactionV3Schema>[] = [];
                            gotSystem.factions.forEach(faction => {
                                allFactionsGet.push(new Promise((resolveFaction, rejectFaction) => {
                                    this.factionsService
                                        .getFactions(faction.name)
                                        .subscribe(factions => {
                                            const indexOfFactionInSystem = gotSystemChart.factions.findIndex(factionElement => {
                                                return factionElement.name_lower === faction.name_lower;
                                            });
                                            if (indexOfFactionInSystem !== -1) {
                                                const indexOfSystem = factions.docs[0].faction_presence.findIndex(presenceElement => {
                                                    return presenceElement.system_name_lower === gotSystem.name_lower;
                                                });
                                                if (indexOfSystem !== -1) {
                                                    gotSystemChart
                                                        .factions[indexOfFactionInSystem]
                                                        .influence = factions.docs[0].faction_presence[indexOfSystem].influence;
                                                    gotSystemChart
                                                        .factions[indexOfFactionInSystem]
                                                        .state = factions.docs[0].faction_presence[indexOfSystem].state;
                                                    gotSystemChart
                                                        .factions[indexOfFactionInSystem]
                                                        .pending_states = factions.docs[0]
                                                            .faction_presence[indexOfSystem]
                                                            .pending_states;
                                                    gotSystemChart
                                                        .factions[indexOfFactionInSystem]
                                                        .recovering_states = factions.docs[0]
                                                            .faction_presence[indexOfSystem].
                                                            recovering_states;
                                                }
                                            }
                                            resolveFaction();
                                        },
                                        (err: HttpErrorResponse) => {
                                            rejectFaction(err);
                                        });
                                }));
                            });
                            Promise.all(allFactionsGet)
                                .then(() => {
                                    returnSystems.push(gotSystemChart);
                                    resolveSystem(gotSystemChart);
                                })
                                .catch(err => {
                                    rejectSystem();
                                });
                        }));
                    });
                    Promise.all(systemPromises)
                        .then(systemChart => {
                            resolve(systemChart)
                        })
                        .catch(err => {
                            reject();
                        });
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
