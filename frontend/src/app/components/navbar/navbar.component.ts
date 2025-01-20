import { Component } from '@angular/core';
import { UserService } from '../../services/UserService/user-service.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  userService: UserService;
  userId: number;

  constructor(userService: UserService, private router: Router) {
    this.userService = userService;
    this.userId = 0;
  }

  logout() {
    this.userService.removeToken();
    this.router.navigate(['/']);
  }

  getUserId(): number {
    this.userId = this.userService.getUserId();
    return this.userId;
  }
}
