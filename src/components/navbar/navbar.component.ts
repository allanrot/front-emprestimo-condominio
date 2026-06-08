import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../services/auth-service';
import { AlertService } from '../../services/alert-service';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('200ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, height: '0px' }))
      ])
    ])
  ]
})
export class NavbarComponent {
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  route = inject(Router);
  isMenuOpen = false;

  get isUserLogged(): boolean {
    const hasUser = this.authService.getLoggedUserValue() !== null;
    const isTokenValid = this.authService.validateToken();

    return hasUser && isTokenValid;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateHome(): void {
    void this.route.navigate(['/']);
  }

  navigateItems(): void {
    void this.route.navigate(['/lista']);
  }

  navigateDashboard(): void {
    void this.route.navigate(['/dashboard']);
  }

  navigateLogin(): void {
    void this.route.navigate(['/login']);
  }

  logout(): void {
    this.alertService.showAlert('Desconectado com sucesso', 'success');
    this.authService.logout();
    void this.route.navigate(['/']);
  }
}
