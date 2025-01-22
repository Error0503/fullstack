import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/UserService/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class PublicGuardService {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean {
    if (this.userService.isLoggedIn) {
      this.router.navigateByUrl('/inner');
    }
    return !this.userService.isLoggedIn;
  }
}

export const publicGuard: CanActivateFn = (route, state) => {
  return inject(PublicGuardService).canActivate();
};
