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

  constructor(userService: UserService) {
    this.userService = userService;
  }

  logout() {
    this.userService.removeToken();
  }
}
