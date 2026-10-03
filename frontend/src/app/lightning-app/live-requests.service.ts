import { Injectable } from '@angular/core';
import { EMPTY, Observable, defer, fromEvent, merge, of, throwError, timer } from 'rxjs';
import { catchError, exhaustMap, filter, finalize, shareReplay, tap, timeout } from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class LightningLiveRequests {
  private streams = new Map<string, Observable<any>>();

  watch<T>(key: string, request: () => Observable<T>, initialError = false): Observable<T> {
    const existing = this.streams.get(key);
    if (existing) return existing;
    let stream: Observable<T>;
    stream = defer(() => {
      let received = false;
      const visible = () => typeof document === 'undefined' || !document.hidden;
      const resumed = typeof document === 'undefined' ? EMPTY : fromEvent(document, 'visibilitychange').pipe(filter(visible));
      return merge(of(0), timer(300000, 300000).pipe(filter(visible)), resumed).pipe(
        exhaustMap(() => request().pipe(
          timeout(20000),
          tap(() => received = true),
          catchError(error => !received && initialError ? throwError(() => error) : EMPTY),
        )),
        finalize(() => { if (this.streams.get(key) === stream) this.streams.delete(key); }),
      );
    }).pipe(shareReplay({bufferSize:1,refCount:true}));
    this.streams.set(key, stream);
    return stream;
  }
}
