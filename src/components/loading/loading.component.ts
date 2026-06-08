import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-loading-component',
  template: `
  @if (loading) {
    <div class="flex justify-center">
      <span class="loading loading-spinner text-primary loading-xl"></span>
    </div>
  }
  `,
  imports: [CommonModule],
  providers: []
})
export class LoadingComponent {
  @Input() loading: boolean = false;
}
