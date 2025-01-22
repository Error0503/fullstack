import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../../../services/UserService/user-service.service';
import heroesData from '../../../assets/heroes.json';
import { RouterModule } from '@angular/router';
import { BuildCardComponent } from "../../build-card/build-card.component";

@Component({
  selector: 'app-build-list',
  standalone: true,
  imports: [RouterModule, BuildCardComponent],
  templateUrl: './build-list.component.html',
  styleUrl: './build-list.component.css',
})
export class BuildListComponent {
  heroes = Object.values(heroesData);
  userService: UserService;
  data: any = [];

  constructor(private http: HttpClient, userService: UserService) {
    this.userService = userService;
    this.getBuilds();
  }

  getBuilds(): void {
    this.http.get(`https://deadlock-builds-backend-9514acf001ce.herokuapp.com/post`).subscribe(
      (data: any) => {
        this.data = data;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
