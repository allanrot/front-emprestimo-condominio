import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedUserSubject = new BehaviorSubject<Login | null>(null);

  loggedUser$: Observable<Login | null> = this.loggedUserSubject.asObservable();

  setLoggedUser(user: Login): void {
    this.loggedUserSubject.next(user);
  }

  getLoggedUserValue(): Login | null {
    return this.loggedUserSubject.value;
  }

  logout(): void {
    this.loggedUserSubject.next(null);
    localStorage.removeItem('condo-share-token');
  }
}
