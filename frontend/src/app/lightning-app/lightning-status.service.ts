import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, timer, of, throwError } from 'rxjs';
import { catchError, switchMap, tap, timeout } from 'rxjs/operators';
export interface LightningHealth { state: 'online' | 'stale' | 'offline' | 'connecting'; sourceUpdatedAt?: string; observedAt?: string; }
export interface LightningRequestState { state:'online'|'stale'|'offline'; sourceUpdatedAt?:string; }
@Injectable({providedIn:'root'})
export class LightningStatusService {
  readonly health$ = new BehaviorSubject<LightningHealth>({state:'connecting'});
  readonly requests$ = new BehaviorSubject<Record<string,LightningRequestState>>({});
  constructor(private http: HttpClient) {}
  start(): Subscription {
    return timer(0,30000).pipe(switchMap(() => this.http.get<LightningHealth>('/api/provider-health').pipe(timeout(12000),catchError(() => of({state:'offline'} as LightningHealth))))).subscribe(health => this.health$.next(health));
  }
  setRequest(url:string, state:LightningRequestState):void {this.requests$.next({...this.requests$.value,[url]:state});}
  clearRequests():void {this.requests$.next({});}
}
@Injectable()
export class LightningStatusInterceptor implements HttpInterceptor {
  constructor(private status: LightningStatusService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(tap(event => {
      if (!(event instanceof HttpResponse) || !request.url.includes('/api/v1/lightning/')) return;
      this.status.setRequest(request.urlWithParams,{state:event.headers.get('X-Data-State') === 'stale' ? 'stale' : 'online',sourceUpdatedAt:event.headers.get('X-Source-Updated-At') || undefined});
    }), catchError(error => {
      if (request.url.includes('/api/v1/lightning/') && (!error.status || error.status >= 500)) this.status.setRequest(request.urlWithParams,{state:'offline'});
      return throwError(() => error);
    }));
  }
}
