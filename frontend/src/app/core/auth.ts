import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TokenStorageService } from './token-storage';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = sessionStorage.getItem("apiURL");

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      tokenStorage.getUser()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email:username, password:password }).pipe(
      map((response: any) => {
        // Store user details and jwt token
        this.tokenStorage.saveToken(response.token);
        const user = this.parseJwt(response.token);
        this.tokenStorage.saveUser(user);
        sessionStorage.setItem("logged","yes");
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(err => {
        return throwError(() => new Error('Authentication failed'));
      })
    );
  }

  logout() {
    // Remove user from storage
    this.tokenStorage.clear();
    this.currentUserSubject.next(null);
  }
  check_login(){
    if(!sessionStorage.getItem("logged")&& !this.tokenStorage.loadCookies()) this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }});
  }
  check_admin(){
    if(!this.tokenStorage.getUser()?.admin) this.router.navigate(['/login'])
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '_').replace('+', '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}
