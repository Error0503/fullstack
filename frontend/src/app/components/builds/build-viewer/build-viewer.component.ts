import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import Build from '../../../interfaces/build';
import heroesData from '../../../assets/heroes.json';
import { UserService } from '../../../services/UserService/user-service.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-build-viewer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './build-viewer.component.html',
  styleUrl: './build-viewer.component.css',
})
export class BuildViewerComponent {
  buildData: Build | undefined;
  loading: boolean = true;
  heroes = Object.values(heroesData);

  userService: UserService;

  @Input()
  set id(id: number) {
    this.http.get(`http://localhost:3000/post/${id}`).subscribe({
      next: (data) => {
        this.buildData = JSON.parse(JSON.stringify({ ...data }));
        console.log(this.buildData);
      },
      error: console.error,
      complete: () => (this.loading = false),
    });
  }

  constructor(
    private http: HttpClient,
    userService: UserService,
    private router: Router
  ) {
    this.userService = userService;
  }

  deleteBuild() {
    this.http
      .delete(`http://localhost:3000/post/${this.buildData?.id}`)
      .subscribe({
        error: console.error,
        complete: () => {
          this.router.navigate(['/builds']);
        },
      });
  }
}
