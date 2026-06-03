import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'welcome-view-component',
  templateUrl: 'welcome-view.component.html',
  imports: []
})
export class WelcomeViewComponent {
  private route = inject(Router);

  disponibilizar(): void {
    void this.route.navigate(['/registrar']);
  }

  procurar(): void {
    void this.route.navigate(['/lista']);
  }

  login(): void {
    void this.route.navigate(['/login']);
  }
}
