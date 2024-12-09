import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ItemComponent } from './components/item/item.component';

export const routes: Routes = [
  {
    title: 'Login',
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    title: 'Items',
    path: 'items',
    component: ItemComponent,
  },
];
