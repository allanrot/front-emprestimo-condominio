import { Routes } from '@angular/router';
import { AvailableItemsListViewComponent } from './available-items-list-view/available-items-list-view.component';
import { WelcomeViewComponent } from './welcome-view/welcome-view.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';

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
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'registrar',
    component: RegisterFormComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicial'
  }
];
