import { Component, inject } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from "ngx-mask";
import { AlertService } from "../../services/alert-service";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AuthApiService } from "../../api/auth-api-service";

@Component({
  template: `
    <form class="flex flex-col items-center gap-2" [formGroup]="form">
      <h1 class="page-title">Registrar</h1>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Nome*</legend>
        <input type="text" class="input w-75 input-secondary" placeholder="Fulano de tal" formControlName="name" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Apartamento*</legend>
        <input type="number" class="input w-75 input-secondary" placeholder="101" formControlName="apartment" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Número de telefone (Whatsapp)*</legend>
        <label class="input validator w-75 input-secondary">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="none">
              <path
                d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
          <input
            type="tel"
            class="tabular-nums"
            required
            placeholder="(00) 00000-0000"
            mask="(00) 00000-0000"
            formControlName="phone"
          />
        </label>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">E-mail*</legend>
        <label class="input validator input-primary w-75">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
          <input type="email" placeholder="exemplo@email.com" required formControlName="email"/>
          <div class="validator-hint hidden">Enter valid email address</div>
        </label>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Senha*</legend>
        <label class="input validator input-primary w-75">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
              ></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </g>
          </svg>
          <input
            type="password"
            placeholder="senha"
            formControlName="password"
          />
        </label>
      </fieldset>

      @if (!registering) {
        <button class="btn btn-primary mt-6" (click)="register()" [disabled]="form.invalid">Registrar</button>
      }
      @else {
        <button class="btn btn-outline btn-primary mt-6">
          <span class="loading loading-spinner"></span>
          Registrando...
        </button>
      }
    </form>
  `,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [AuthApiService]
})
export class RegisterFormComponent {
  private alertService = inject(AlertService);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly api = inject(AuthApiService);
  protected readonly route = inject(Router);
  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    apartment: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  registering: boolean = false;

  register(): void {
    this.registering = true;
    this.api
      .register({ ...this.form.value, phone: this.form.value.phone?.replace(/\D/g, '') })
      .pipe(finalize(() => this.registering = false))
      .subscribe({
        next: () => {
          this.alertService.showAlert('Usuário cadastrado com sucesso', 'success');
          this.route.navigate(['/login']);
        },
        error: () => {
          this.alertService.showAlert('Erro ao cadastrar usuário', 'error');
        }
      });
  }
}
