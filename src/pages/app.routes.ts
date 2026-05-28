import { Routes } from '@angular/router';
import { ListBorrowingComponent } from './list-orders/list-borrowing.component';

export const routes: Routes = [
  {
    path: 'lista',
    component: ListBorrowingComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'lista'
  }
];
