import { Component, inject } from "@angular/core";
import { ItemsApiService } from "../../../api/items-api-service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgxMaskDirective } from "ngx-mask";
import { Item } from "../../../models/item";
import { AlertService } from "../../../services/alert-service";
import { finalize } from "rxjs";
import { LoadingComponent } from "../../../components/loading/loading.component";

@Component({
  template: `
  <app-loading-component [loading]="searching"/>
  @if (!searching) {
    <form class="flex flex-col items-center gap-2" [formGroup]="form">
      <div class="flex gap-4">
        <button class="btn btn-circle btn-primary" (click)="dashboard()">
          <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="page-title">Alterar item</h1>
      </div>
      @if (formInvalid && !searching) {
        <p class="text-xs text-red-400">Não foi possível encontrar item, retorne para listagem e tente novamente.</p>
      }
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Nome*</legend>
        <input type="text" class="input w-75 input-secondary" placeholder="Furadeira" formControlName="name" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Descrição*</legend>
        <input type="text" class="input w-75 input-secondary" placeholder="Em bom estado, possui brocas" formControlName="description" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Valor de locação (opcional)</legend>
          <input
            type="text"
            class="input w-75 input-secondary"
            placeholder="R$ 5,00"
            prefix="R$ "
            mask="separator.2"
            thousandSeparator="."
            decimalMarker=","
            formControlName="rentPricing"
            />
      </fieldset>

      @if (!updating) {
        <button class="btn btn-primary mt-6" (click)="update()" [disabled]="formInvalid">Alterar</button>
      }
      @else {
        <button class="btn btn-outline btn-primary mt-6">
          <span class="loading loading-spinner"></span>
          Alterando...
        </button>
      }
      </form>
  }
  `,
  imports: [ReactiveFormsModule, NgxMaskDirective, LoadingComponent],
  providers: [ItemsApiService]
})
export class UpdateItemFormComponent {
  private readonly api = inject(ItemsApiService);
  private readonly route = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  protected form = this.formBuilder.group({
    name: [{ value: '', disabled: true }, [Validators.required]],
    description: [{ value: '', disabled: true }, [Validators.required]],
    rentPricing: [{ value: 0, disabled: true }]
  });
  searching: boolean = false;
  updating: boolean = false;
  formInvalid: boolean = false;

  ngOnInit(): void {
    this.formInvalid = true;
    this.getItem();
  }

  getItem(): void {
    this.searching = true;
    this.api
      .getItem(this.activeRoute.snapshot.params['id'])
      .pipe(finalize(() => this.searching = false))
      .subscribe({
        next: (item: Item) => {
          this.form.patchValue({
            name: item.name,
            description: item.description,
            rentPricing: item.rentPricing
          });
          this.formInvalid = false;
          this.form.controls.name.enable();
          this.form.controls.description.enable();
          this.form.controls.rentPricing.enable();
        },
        error: () => {
          this.alertService.showAlert('Erro ao buscar item', 'error');
        }
      });
  }

  dashboard(): void {
    void this.route.navigate(['/dashboard']);
  }

  update(): void {
    this.updating = true;
    this.api
      .updateItem({ ...this.form.value, _id: this.activeRoute.snapshot.params['id'] } as Partial<Item>)
      .pipe(finalize(() => this.updating = false))
      .subscribe({
        next: () => {
          this.alertService.showAlert('Item alterado com sucesso', 'success');
          this.dashboard();
        },
        error: () => {
          this.alertService.showAlert('Erro ao alterar item', 'error');
        }
      });
  }
}
