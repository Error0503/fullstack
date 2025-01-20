import { Routes } from '@angular/router';
import { publicGuard } from './guards/public.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { HeroComponent } from './components/heroes/hero/hero.component';
import { ItemsComponent } from './components/items/items.component';
import { BuildListComponent } from './components/builds/build-list/build-list.component';
import { BuildViewerComponent } from './components/builds/build-viewer/build-viewer.component';
import { BuildEditorComponent } from './components/builds/build-editor/build-editor.component';

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
    title: 'Login',
    path: 'login',
    component: LoginComponent,
  },
  {
    title: 'Register',
    path: 'register',
    component: RegisterComponent,
  },
  {
    title: 'Heroes',
    path: 'heroes',
    component: HeroesComponent,
  },
  {
    title: 'Heroes',
    path: 'heroes/:id',
    component: HeroComponent,
  },
  {
    title: 'Items',
    path: 'items',
    component: ItemsComponent,
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
  {
    title: 'Builds',
    path: 'builds',
    component: BuildListComponent,
  },
  {
    title: 'Build Editor',
    path: 'builds/editor',
    component: BuildEditorComponent,
  },
  {
    title: 'Builds',
    path: 'builds/:id',
    component: BuildViewerComponent,
  },
  {
    title: 'Builds',
    path: 'builds/:id/edit',
    component: BuildEditorComponent,
  },
];
