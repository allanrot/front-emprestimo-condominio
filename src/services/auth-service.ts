import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../models/login';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedUserSubject = new BehaviorSubject<Login | null>(null);
  loggedUser$: Observable<Login | null> = this.loggedUserSubject.asObservable();

  constructor() {
    if (this.validateToken()) {
      this.loggedUserSubject.next(this.getLoggedUserValue());
    }
  }

  setLoggedUser(user: Login): void {
    localStorage.setItem(
      'condo-share-user',
      JSON.stringify(user)
    );
    this.loggedUserSubject.next(user);
  }

  getLoggedUserValue(): Login | null {
    if (localStorage.getItem('condo-share-user') !== null)
      return JSON.parse(localStorage.getItem('condo-share-user')!) as Login;

    return null;
  }

  logout(): void {
    this.loggedUserSubject.next(null);
    localStorage.removeItem('condo-share-token');
    localStorage.removeItem('condo-share-user');
  }

  validateToken(): boolean {
    const token = localStorage.getItem('condo-share-token');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp > currentTime) {
          return true;
        }
      } catch (error) {
        console.error('Token inválido ou corrompido', error);
      }
    }

    return false;
  }
}
