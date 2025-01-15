import { Routes } from '@angular/router';
import { publicGuard } from './guards/public.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';

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
  {
    title: 'Profile',
    path: 'profile/:id',
    component: ProfileComponent,
  },
  {
    title: 'Profile',
    path: 'profile/:id/edit',
    component: ProfileEditComponent,
  },
];
