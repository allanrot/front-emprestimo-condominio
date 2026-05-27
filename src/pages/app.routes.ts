import { Routes } from '@angular/router';
import { ListOrdersComponent } from './list-orders/list-orders.component';

export const routes: Routes = [
  {
    path: 'pedidos',
    component: ListOrdersComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pedidos'
  }
];
