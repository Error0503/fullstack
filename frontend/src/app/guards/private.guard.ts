import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/UserService/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class PrivateGuardService {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean {
    if (!this.userService.isLoggedIn) {
      this.router.navigateByUrl('/login');
    }
    return this.userService.isLoggedIn;
  }
}

export const privateGuard: CanActivateFn = (route, state) => {
  return inject(PrivateGuardService).canActivate();
};
