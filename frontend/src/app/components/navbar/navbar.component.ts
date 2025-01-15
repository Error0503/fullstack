import { Component } from '@angular/core';
import { UserService } from '../../services/UserService/user-service.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  userService: UserService;
  userId: number;

  constructor(userService: UserService) {
    this.userService = userService;
    this.userId = 0;
  }

  logout() {
    this.userService.removeToken();
  }

  getUserId(): number {
    this.userId = this.userService.getUserId();
    return this.userId;
  }
}
