import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../../../services/UserService/user-service.service';

@Component({
  selector: 'app-build-list',
  standalone: true,
  imports: [],
  templateUrl: './build-list.component.html',
  styleUrl: './build-list.component.css',
})
export class BuildListComponent {
  userService: UserService;
  data: any = [];
  constructor(private http: HttpClient, userService: UserService) {
    this.userService = userService;
    this.getBuilds();
  }

  getBuilds(): void {
    this.http.get(`http://localhost:3000/post`).subscribe(
      (data: any) => {
        console.log(data);
        this.data = data;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
