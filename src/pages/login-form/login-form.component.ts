import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthApiService } from "../../api/auth-api-service";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AlertService } from "../../services/alert-service";
import { User } from "../../models/user";
import { AuthService } from "../../services/auth-service";

@Component({
  template: `
    <div class="flex flex-col items-center gap-4 justify-center" [formGroup]="form">
      <h1 class="page-title">Login</h1>
      <label class="input validator">
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
        <input type="email" placeholder="exemplo@email.com" formControlName="email" />
      </label>
      <div class="validator-hint hidden">Enter valid email address</div>
      <label class="input validator">
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

      @if (!authenticating) {
        <button class="btn btn-primary mt-4" (click)="login()" [disabled]="form.invalid">Login</button>
      }
      @else {
        <button class="btn btn-outline btn-primary mt-4">
          <span class="loading loading-spinner"></span>
          Autenticando...
        </button>
      }
      <p class="text-xs">Não possui uma conta? <a class="link link-primary" (click)="register()">Registrar</a></p>
    </div>
  `,
  imports: [ReactiveFormsModule],
  providers: [AuthApiService]
})
export class LoginFormComponent implements OnInit {
  private alertService = inject(AlertService);
  protected readonly route = inject(Router);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly api = inject(AuthApiService);
  protected readonly authService = inject(AuthService);
  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  authenticating: boolean = false;

  ngOnInit(): void {
    this.form.markAsTouched();
  }

  login(): void {
    this.authenticating = true;
    this.api.login(this.form.value as Partial<User>).pipe(finalize(() => this.authenticating = false)).subscribe({
      next: (dadosLogin) => {
        this.authService.setLoggedUser(dadosLogin);
        localStorage.setItem(
          'condo-share-token',
          dadosLogin.token
        );
        this.route.navigate(['/dashboard']);
      },
      error: (mensagem: string) => {
        this.alertService.showAlert(mensagem, 'error');
      }
    });
  }

  register(): void {
    void this.route.navigate(['/registrar']);
  }
}
