import { Routes } from '@angular/router';
import { AvailableItemsListViewComponent } from './available-items-list-view/available-items-list-view.component';
import { WelcomeViewComponent } from './welcome-view/welcome-view.component';

export const routes: Routes = [
  {
    path: 'inicial',
    component: WelcomeViewComponent
  },
  {
    path: 'lista',
    component: AvailableItemsListViewComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicial'
  }
];
