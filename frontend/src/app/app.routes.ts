import { Routes } from '@angular/router';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    title: 'auth',
    path: 'auth',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
    canActivate: [publicGuard],
  },
];
