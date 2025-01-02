import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';

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
    component: ItemsComponent,
  },
];
