import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(
        @Inject('BASE_API_URL') private baseUrl: string) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let apiReq = req
        if (req.url.includes('/api') && !req.url.startsWith('http')) {
            apiReq = req.clone({url: `${this.baseUrl}${req.url}`});
        }
        return next.handle(apiReq);
    }
}
