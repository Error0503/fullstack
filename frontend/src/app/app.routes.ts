import { Routes } from '@angular/router';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    title: 'Login',
    path: 'login',
    loadChildren: () =>
      import('./authentication/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
    canActivate: [publicGuard],
  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
];
