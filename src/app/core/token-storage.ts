import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private TOKEN_KEY = 'auth-token';
  private USER_KEY = 'auth-user';

  constructor(private cookieService: CookieService) { }

  saveToken(token: string): void {
    const my_date: Date = new Date();
    my_date.setHours( my_date.getHours() + 8 );
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.setItem(this.TOKEN_KEY, token);
    this.cookieService.set(this.TOKEN_KEY,token,{expires:my_date});
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  saveUser(user: any): void {
    const my_date: Date = new Date();
    my_date.setHours( my_date.getHours() + 8 );
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.cookieService.set(this.USER_KEY,JSON.stringify(user),{expires:my_date});
  }

  getUser(): any {
    const user = sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  clear(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.cookieService.delete(this.TOKEN_KEY);
    this.cookieService.delete(this.USER_KEY);
    sessionStorage.removeItem("logged");
  }
  loadCookies():boolean{
    let user=this.cookieService.get(this.USER_KEY);
    let token=this.cookieService.get(this.TOKEN_KEY);
    if(!user||!token) return false;
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.setItem(this.USER_KEY, user);
    sessionStorage.setItem("logged","yes")
    return true;
  }
}