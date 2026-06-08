import { Component, computed, inject, signal } from "@angular/core";
import { ItemsApiService } from "../../api/items-api-service";
import { Router } from "@angular/router";
import { Item } from "../../models/item";
import { AlertService } from "../../services/alert-service";
import { finalize } from "rxjs";
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
  template: `
    <div class="flex flex-col items-center justify-center">
      <h1 class="page-title">Meus itens cadastrados</h1>
      <button class="btn btn-primary mb-8" (click)="register()">Cadastrar novo item</button>
      <app-loading-component [loading]="searching"/>
      @if (!searching) {
      <label class="input mb-4">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" required placeholder="Buscar" [value]="searchTerm()"
          (input)="searchTerm.set($any($event.target).value)" />
      </label>
      <div class="flex flex-col xl:grid xl:grid-cols-3 justify-center gap-8">
          @for(item of filteredItems(); track item._id) {
            <div class="card bg-neutral text-neutral-content w-96 h-full flex flex-col justify-between mx-auto">
              <div class="flex">
                <span [class]="item.available ? 'badge badge-sm badge-success' : 'badge badge-sm badge-error'"><b>{{
                    item.available ? 'Disponível' : 'Indisponível' }}</b></span>
              </div>
              <div class="card-body items-center text-center">
                <h2 class="card-title"><b>Item: </b>{{ item.name }}</h2>
                <p><b>Descrição: </b>{{ item.description }}</p>
                <p><b>Preço de locação: </b>R$ {{ item.rentPricing ?? 0 }}</p>
                <div class="flex-col mt-4 items-center card-actions justify-end">
                  <div class="flex gap-2 justify-center">
                    <button class="btn btn-primary" (click)="update(item._id)">Editar</button>
                    <button class="btn btn-error" (click)="modal_remove.showModal()">Remover</button>
                    <dialog #modal_remove class="modal">
                      <div class="modal-box">
                        <h3 class="text-lg font-bold">Deseja remover esse item?</h3>
                        <p class="py-4">Deseja confirmar essa ação?</p>
                        <div class="modal-action">
                          <button class="btn btn-error" (click)="remove(item._id)">Remover</button>
                          <form method="dialog">
                            <button class="btn btn-outline">Cancelar</button>
                          </form>
                        </div>
                      </div>
                      <form method="dialog" class="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                  </div>
                  <button [class]="item.available ? 'btn btn-outline btn-warning' : 'btn btn-outline btn-success'" (click)="modal_available.showModal()">
                    Marcar como {{ item.available ? 'indisponível' : 'disponível' }}
                  </button>
                  <dialog #modal_available class="modal">
                    <div class="modal-box">
                      <h3 class="text-lg font-bold">Marcar como {{ item.available ? 'indisponível' : 'disponível' }}?</h3>
                      <p class="py-4">Deseja confirmar essa ação?</p>
                      <div class="modal-action">
                        <button class="btn btn-primary" (click)="changeAvailability(item._id, !item.available)">Confirmar</button>
                        <form method="dialog">
                          <button class="btn btn-error">Cancelar</button>
                        </form>
                      </div>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </div>
              </div>
            </div>
          }
      </div>
      }
    </div>
  `,
  imports: [LoadingComponent],
  providers: [ItemsApiService]
})
export class DashboardViewComponent {
  private readonly route = inject(Router);
  private readonly alertService = inject(AlertService);
  api = inject(ItemsApiService);
  items = signal<Item[]>([])
  searching: boolean = false;
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

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.searching = true;
    this.api.listItemsPerLoggedUser().pipe(finalize(() => this.searching = false)).subscribe({
      next: (resposta) => {
        this.items.set(resposta);
      },
      error: () =>
        this.alertService.showAlert('Erro ao buscar itens de usuário', 'error')
    });
  }

  register(): void {
    void this.route.navigate(['/dashboard/register-item']);
  }

  update(id: string): void {
    void this.route.navigate(['/dashboard/update-item', id]);
  }

  remove(id: string): void {
    this.api.removeItem(id).subscribe({
      next: () => {
        this.alertService.showAlert('Item removido com sucesso!', 'success');
        this.getItems();
      },
      error: () =>
        this.alertService.showAlert('Erro ao remover item', 'error')
    });
  }

  changeAvailability(id: string, availability: boolean): void {
    this.api.changeAvailability(id, availability).subscribe({
      next: () => {
        this.alertService.showAlert('Disponibilidade de item alterada com sucesso!', 'success');
        this.getItems();
      },
      error: () =>
        this.alertService.showAlert('Erro ao alterar disponibilidade de item', 'error')
    });
  }
}
