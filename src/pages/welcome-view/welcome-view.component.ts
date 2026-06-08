import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'welcome-view-component',
  templateUrl: 'welcome-view.component.html',
  imports: []
})
export class WelcomeViewComponent {
  private route = inject(Router);
  activeToken: boolean = false;

  ngOnInit(): void {
    this.searchToken();
  }

  searchToken(): void {
    this.activeToken = !!localStorage.getItem('condo-share-token');
  }

  search(): void {
    void this.route.navigate(['/lista']);
  }

  dashboard(): void {
    void this.route.navigate(['/dashboard']);
  }

  register(): void {
    void this.route.navigate(['/registrar']);
  }

  login(): void {
    void this.route.navigate(['/login']);
  }
}
