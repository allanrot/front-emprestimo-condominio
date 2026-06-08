import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { ItemsApiService } from "../../api/items-api-service";
import { Item } from "../../models/item";
import { LoadingComponent } from "../../components/loading/loading.component";
import { finalize } from "rxjs";
import { AuthApiService } from "../../api/auth-api-service";
import { User } from "../../models/user";
import { AuthService } from "../../services/auth-service";
import { Login } from "../../models/login";
import { Router } from "@angular/router";

@Component({
  selector: 'available-items-list-view-component',
  templateUrl: 'available-items-list-view.component.html',
  imports: [LoadingComponent],
  providers: [ItemsApiService]
})
export class AvailableItemsListViewComponent implements OnInit {
  route = inject(Router);
  apiItems = inject(ItemsApiService);
  apiUsers = inject(AuthApiService);
  authService = inject(AuthService);
  items: Item[] = [];
  searching: boolean = false;
  itemOwner: Partial<User> | null = null;
  loggedUser: Login | null = this.authService.getLoggedUserValue();
  @ViewChild('modal_item') modalRef!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.searching = true;
    this.apiItems.listItems().pipe(finalize(() => this.searching = false)).subscribe({
      next: (resposta) => {
        this.items = resposta.map((item) => { return { ...item, rentPricing: item.rentPricing ?? 0 } });
      },
      error: () => { }
    });
  }

  searchOwner(item: Item): void {
    item.loading = true;
    this.apiUsers
      .getUserById(item.userId)
      .pipe(finalize(() => item.loading = false))
      .subscribe({
        next: (owner: Partial<User>) => {
          this.itemOwner = owner;
          this.modalRef.nativeElement.showModal();
        },
        error: () => { }
      });
  }

  contactOwner(item: Item): void {
    const mensagem = `Olá, ${this.itemOwner?.name}, sou ${this.loggedUser?.name} do apartamento ${this.loggedUser?.apartment}!\nVim pelo CondoShare e gostaria de ${item.rentPricing === 0 ? 'emprestar' : 'alugar'} o seu item "${item.name}".`;

    window.open(`https://api.whatsapp.com/send/?phone=55${this.itemOwner?.phone}&text=${encodeURIComponent(mensagem)}`, '_blank');
  }

  update(id: string): void {
    void this.route.navigate(['/dashboard/update-item', id]);
  }
}
