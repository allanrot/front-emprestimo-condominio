import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Item } from "../models/item";

@Injectable({
  providedIn: 'root'
})
export class ItemsApiService {
  private http = inject(HttpClient);
  private api = 'https://api-emprestimo-condominio.onrender.com';

  listItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.api}/items`);
  }

  createItem(item: Partial<Item>): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this.api}/items`, item);
  }

  listItemsPerLoggedUser(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.api}/items/me`);
  }

  getItem(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.api}/items/${id}`);
  }

  changeAvailability(id: string, availability: boolean): Observable<{ mensagem: string }> {
    return this.http.patch<{ mensagem: string }>(`${this.api}/items/${id}/change-status`, { available: availability });
  }

  removeItem(id: string): Observable<{ mensagem: string }> {
    return this.http.delete<{ mensagem: string }>(`${this.api}/items/${id}`);
  }

  updateItem(item: Partial<Item>): Observable<{ mensagem: string }> {
    return this.http.put<{ mensagem: string }>(`${this.api}/items/${item._id}`, item);
  }
}
