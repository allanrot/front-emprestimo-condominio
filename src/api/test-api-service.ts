import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Login } from "../models/login";

@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  private http = inject(HttpClient);

  private api = 'https://api-emprestimo-condominio.onrender.com';

  listar() {
    return this.http.get(`${this.api}/items`);
  }

  criar(item: any) {
    return this.http.post(`${this.api}/items`, item);
  }

  register(userForm: any): Observable<object> {
    return this.http.post(`${this.api}/auth/registrar`, userForm);
  }

  login(userForm: any): Observable<Login> {
    return this.http.post<Login>(`${this.api}/auth/login`, userForm);
  }
}
