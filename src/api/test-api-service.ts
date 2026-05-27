import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  private http = inject(HttpClient);

  private api = 'https://api-emprestimo-condominio.onrender.com/items';

  listar() {
    return this.http.get(this.api);
  }

  criar(item: any) {
    return this.http.post(this.api, item);
  }
}
