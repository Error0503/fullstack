import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/UserService/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class PrivateGuardService {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.userService.isLoggedIn;
    const userRole = this.userService.getRole();
    const requiredRoles = route.data['roles'] as Array<string>;
    const canAccess =
      this.userService.canAccess(route.params['id']) &&
      (requiredRoles ? requiredRoles.includes(userRole) : false);

    if (!isLoggedIn || !canAccess) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

export const privateGuard: CanActivateFn = (route, state) => {
  return inject(PrivateGuardService).canActivate(route);
};
