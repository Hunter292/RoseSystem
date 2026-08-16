import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStorageService } from './token-storage';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';

@Injectable()
export class authInterceptor implements HttpInterceptor {
  private authHeader = 'Authorization';
  constructor(
    private tokenService: TokenStorageService,
    private router: Router
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();
    let authReq = request;

    if (token) {
      authReq = request.clone({
        headers: request.headers.set(
          this.authHeader,
          `Bearer ${token}`
        )
      });
    }

    return next.handle(authReq).pipe(timeout(10000),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Auto logout if 401 or 403 response returned from API
          this.tokenService.clear();
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
          return throwError(() => error);
        }
        return throwError(() => error);
      })
    );
  }
}