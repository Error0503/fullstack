import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { HeroComponent } from './components/heroes/hero/hero.component';

export const routes: Routes = [
  {
    title: 'Login',
    path: 'login',
    component: LoginComponent,
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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
