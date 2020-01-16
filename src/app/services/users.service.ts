import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EBGSDonor, EBGSPatron, EBGSCredits, EBGSUsers, EBGSUser, EBGSSystemSchemaWOHistory, EBGSSystemSchema } from '../typings';
import { CustomEncoder } from './custom.encoder';

@Injectable()
export class UsersService {

    constructor(private http: HttpClient) { }

    getDonors(): Observable<EBGSDonor[]> {
        return this.http.get<EBGSDonor[]>('/frontend/donors')
            .pipe(map((donations: EBGSDonor[]): EBGSDonor[] => {
                donations.forEach((singleDonation, i, allDonations) => {
                    allDonations[i].date = new Date(singleDonation.date);
                });
                return donations;
            }));
    }

    getPatrons(): Observable<EBGSPatron[]> {
        return this.http.get<EBGSPatron[]>('/frontend/patrons')
            .pipe(map((patrons: EBGSPatron[]): EBGSPatron[] => {
                patrons.forEach((singlePatron, i, allPatrons) => {
                    allPatrons[i].since = new Date(singlePatron.since);
                });
                return patrons;
            }));
    }

    getCredits(): Observable<EBGSCredits[]> {
        return this.http.get<EBGSCredits[]>('/frontend/credits');
    }

    getUsersBegins(page: string, user: string): Observable<EBGSUsers> {
        return this.http.get<EBGSUsers>('/frontend/users', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('page', page + 1).set('beginsWith', user)
        }).pipe(map((users: EBGSUsers): EBGSUsers => {
            users.docs.forEach((singleUser, i, allUsers) => {
                allUsers[i].patronage.since = new Date(singleUser.patronage.since);
                allUsers[i].donation.forEach((donation, j) => {
                    allUsers[i].donation[j].date = new Date(donation.date);
                });
            });
            return users;
        }));
    }

    getUser(id: string): Observable<EBGSUsers> {
        return this.http.get<EBGSUsers>('/frontend/users', {
            params: new HttpParams({ encoder: new CustomEncoder() }).set('id', id)
        }).pipe(map((users: EBGSUsers): EBGSUsers => {
            users.docs.forEach((singleUser, i, allUsers) => {
                allUsers[i].patronage.since = new Date(singleUser.patronage.since);
                allUsers[i].donation.forEach((donation, j) => {
                    allUsers[i].donation[j].date = new Date(donation.date);
                });
            });
            return users;
        }));
    }

    putUser(user: EBGSUser): Observable<boolean> {
        return this.http.put<boolean>('/frontend/users', user);
    }
}
