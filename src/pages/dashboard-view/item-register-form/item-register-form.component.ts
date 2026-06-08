import { Component, inject } from "@angular/core";
import { ItemsApiService } from "../../../api/items-api-service";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgxMaskDirective } from "ngx-mask";
import { Item } from "../../../models/item";
import { AlertService } from "../../../services/alert-service";
import { finalize } from "rxjs";

@Component({
  template: `
  <form class="flex flex-col items-center gap-2" [formGroup]="form">
    <div class="flex gap-4">
      <button class="btn btn-circle btn-primary" (click)="dashboard()">
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="24" height="24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      <h1 class="page-title">Cadastrar item</h1>
    </div>
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

    @if (!registering) {
      <button class="btn btn-primary mt-6" (click)="register()" [disabled]="form.invalid">Cadastrar</button>
    }
    @else {
      <button class="btn btn-outline btn-primary mt-6">
        <span class="loading loading-spinner"></span>
        Cadastrando...
      </button>
    }
    </form>
  `,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [ItemsApiService]
})
export class ItemRegisterFormComponent {
  private readonly api = inject(ItemsApiService);
  private readonly route = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  protected form = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    rentPricing: ['']
  });
  registering: boolean = false;

  dashboard(): void {
    void this.route.navigate(['/dashboard']);
  }

  register(): void {
    this.registering = true;
    this.api
      .createItem(this.form.value as Partial<Item>)
      .pipe(finalize(() => this.registering = false))
      .subscribe({
        next: () => {
          this.alertService.showAlert('Item cadastrado com sucesso', 'success');
          this.dashboard();
        },
        error: () => {
          this.alertService.showAlert('Erro ao cadastrar novo item', 'error');
        }
      });
  }
}
