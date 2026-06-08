import { Routes } from '@angular/router';
import { AvailableItemsListViewComponent } from './available-items-list-view/available-items-list-view.component';
import { WelcomeViewComponent } from './welcome-view/welcome-view.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { authGuard } from '../interceptors/auth-guard';
import { ItemRegisterFormComponent } from './dashboard-view/item-register-form/item-register-form.component';
import { UpdateItemFormComponent } from './dashboard-view/update-item-form/update-item-form.component';

export const routes: Routes = [
  {
    path: 'inicial',
    component: WelcomeViewComponent
  },
  {
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'registrar',
    component: RegisterFormComponent
  },
  {
    path: 'lista',
    component: AvailableItemsListViewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardViewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/register-item',
    component: ItemRegisterFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/update-item/:id',
    component: UpdateItemFormComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicial'
  }
];
