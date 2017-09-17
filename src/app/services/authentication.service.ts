import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EBGSUser } from '../typings';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    isAuthenticated(): Observable<boolean> {
        return this.http.get<boolean>('/auth/check');
    }

    getUser(): Observable<EBGSUser> {
        return this.http.get<EBGSUser>('/auth/user');
    }
}
