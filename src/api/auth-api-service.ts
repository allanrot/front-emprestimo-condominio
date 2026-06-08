import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Login } from "../models/login";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  private api = 'https://api-emprestimo-condominio.onrender.com';

  register(userForm: User): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this.api}/auth/register`, userForm);
  }

  login(userForm: Partial<User>): Observable<Login> {
    return this.http.post<Login>(`${this.api}/auth/login`, userForm);
  }

  getUserById(id: string): Observable<Partial<User>> {
    return this.http.get<Partial<User>>(`${this.api}/auth/${id}`);
  }
}
