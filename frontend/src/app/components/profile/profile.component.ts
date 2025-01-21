import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import User from '../../interfaces/user';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/UserService/user-service.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  loggedInUserId: number;
  user: User | undefined;
  num: number = 0;

  @Input()
  set id(id: number) {
    this.getUserData(id);
    this.num = id;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
    this.loggedInUserId = this.userService.getUserId();
  }

  getUserData(id: number): void {
    this.http.get(`http://localhost:3000/user/?id=${id}`).subscribe({
      next: (data: any) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Error fetching user posts:', error);
        this.router.navigate(['/']);
      },
    });
  }
}
