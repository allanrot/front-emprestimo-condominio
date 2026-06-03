import { Component, inject } from "@angular/core";
import { TestApiService } from "../../api/test-api-service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  template: `
    <main class="flex flex-col items-center gap-4 justify-center" [formGroup]="form">
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
          formControlName="senha"
        />
      </label>

      <button class="btn btn-primary mt-4" (click)="login()" [disabled]="form.invalid">Login</button>
    </main>
  `,
  imports: [ReactiveFormsModule],
  providers: [TestApiService]
})
export class LoginFormComponent {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly api = inject(TestApiService);
  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required]],
    senha: ['', [Validators.required]]
  });

  login(): void {
    this.api.login(this.form.value).subscribe((dadosLogin) => {
      localStorage.setItem(
        'token',
        dadosLogin.token
      );
    });
  }
}
