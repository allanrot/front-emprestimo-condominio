import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AlertService } from '../services/alert-service';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="relative w-full">
      @if (alertService.currentAlert(); as alert) {
        <div
          [@slideInOut]
          role="alert"
          class="alert rounded-none m-0 absolute top-0 left-0 w-full z-50 shadow-md"
          [class.alert-success]="alert.type === 'success'"
          [class.alert-error]="alert.type === 'error'"
          [class.alert-warning]="alert.type === 'warning'"
        >
          @if (alert.type === 'success') {
            <svg xmlns="http://w3.org" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          } @else if (alert.type === 'error') {
            <svg xmlns="http://w3.org" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          } @else if (alert.type === 'warning') {
            <svg xmlns="http://w3.org" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          }
          <span>{{ alert.message }}</span>
        </div>
      }
      <app-navbar-component/>
      <main class="py-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {
  protected readonly alertService = inject(AlertService);
  protected readonly route = inject(Router);
}
