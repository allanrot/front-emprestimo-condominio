import { Component, inject, OnInit } from "@angular/core";
import { TestApiService } from "../../api/test-api-service";

@Component({
  selector: 'available-items-list-view-component',
  templateUrl: 'available-items-list-view.component.html',
  imports: [],
  providers: [TestApiService]
})
export class AvailableItemsListViewComponent implements OnInit {
  api = inject(TestApiService);

  ngOnInit(): void {
    this.api.listar().subscribe();
  }
}
