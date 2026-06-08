import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { ItemsApiService } from "../../api/items-api-service";
import { Item } from "../../models/item";
import { LoadingComponent } from "../../components/loading/loading.component";
import { finalize } from "rxjs";
import { AuthApiService } from "../../api/auth-api-service";
import { User } from "../../models/user";
import { AuthService } from "../../services/auth-service";
import { Login } from "../../models/login";
import { Router } from "@angular/router";
import { AlertService } from "../../services/alert-service";

@Component({
  selector: 'available-items-list-view-component',
  templateUrl: 'available-items-list-view.component.html',
  imports: [LoadingComponent],
  providers: [ItemsApiService]
})
export class AvailableItemsListViewComponent implements OnInit {
  private readonly alertService = inject(AlertService);
  route = inject(Router);
  apiItems = inject(ItemsApiService);
  apiUsers = inject(AuthApiService);
  authService = inject(AuthService);
  items = signal<Item[]>([]);
  searching: boolean = false;
  itemOwner: Partial<User> | null = null;
  selectedItem: Item | null = null;
  loggedUser: Login | null = this.authService.getLoggedUserValue();
  searchTerm = signal<string>('');
  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.items();
    }

    return this.items().filter(item =>
      item.name.toLowerCase().includes(term)
    );
  });
  @ViewChild('modal_item') modalRef!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.searching = true;
    this.apiItems.listItems().pipe(finalize(() => this.searching = false)).subscribe({
      next: (resposta) => {
        this.items.set(resposta.map((item) => { return { ...item, rentPricing: item.rentPricing ?? 0 } }));
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
          this.selectedItem = item;
          this.modalRef.nativeElement.showModal();
        },
        error: () =>
          this.alertService.showAlert('Não foi possível encontrar o dono do item selecionado', 'error')
      });
  }

  contactOwner(): void {
    const mensagem = `Olá, ${this.itemOwner?.name}, sou ${this.loggedUser?.name} do apartamento ${this.loggedUser?.apartment}!\nVim pelo CondoShare e gostaria de ${this.selectedItem?.rentPricing === 0 ? 'emprestar' : 'alugar'} o seu item "${this.selectedItem?.name}" ${this.selectedItem?.rentPricing === 0 ? '' : `por R$ ${this.selectedItem?.rentPricing}`}.`;

    window.open(`https://api.whatsapp.com/send/?phone=55${this.itemOwner?.phone}&text=${encodeURIComponent(mensagem)}`, '_blank');
  }

  update(id: string): void {
    void this.route.navigate(['/dashboard/update-item', id]);
  }

  changeAvailability(id: string, availability: boolean): void {
    this.apiItems.changeAvailability(id, availability).subscribe({
      next: () => {
        this.alertService.showAlert('Disponibilidade de item alterada com sucesso!', 'success');
        this.getItems();
      },
      error: () =>
        this.alertService.showAlert('Erro ao alterar disponibilidade de item', 'error')
    });
  }

  closeModalItem(): void {
    setTimeout(() => {
      this.itemOwner = null;
      this.selectedItem = null;
    }, 600);
  }
}
