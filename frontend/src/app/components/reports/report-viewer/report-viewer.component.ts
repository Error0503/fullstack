import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Report from '../../../interfaces/report';
import Build from '../../../interfaces/build';
import heroesData from '../../../assets/heroes.json';
import { UserService } from '../../../services/UserService/user-service.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './report-viewer.component.html',
  styleUrl: './report-viewer.component.css',
})
export class ReportViewerComponent {
  heroes = Object.values(heroesData);
  reportData: Report | undefined;
  buildData: Build | undefined;

  loading: boolean = true;
  userService: UserService;

  constructor(
    userService: UserService,
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {
    this.userService = userService;
  }

  @Input()
  set id(id: number) {
    this.fetchReport(id);
  }

  private fetchReport(id: number) {
    this.http.get(`http://localhost:3000/report/${id}`).subscribe({
      next: (data) => {
        this.reportData = JSON.parse(JSON.stringify(data));
      },
      complete: () => {
        console.log(this.reportData);
        this.fetchBuild(this.reportData?.post.id);
      },
    });
  }

  private fetchBuild(id: number | undefined) {
    console.log(id);

    if (id !== undefined) {
      this.http.get(`http://localhost:3000/post/${id}`).subscribe({
        next: (data) => {
          this.buildData = JSON.parse(JSON.stringify({ ...data }));
          console.log(this.buildData);
        },
        error: console.error,
        complete: () => {
          this.loading = false;
          console.log(this.buildData);
        },
      });
    }
  }

  deleteBuild() {
    this.http
      .delete(`http://localhost:3000/post/${this.buildData?.id}`)
      .subscribe({
        error: () => {
          this.location.back();
        },
        complete: () => {
          this.location.back();
        },
      });
  }

  markAsResolved() {
    this.http
      .put(`http://localhost:3000/report/${this.reportData?.id}`, {
        status: 'resolved',
      })
      .subscribe({
        error: () => {
          this.location.back();
        },
        complete: () => {
          this.location.back();
        },
      });
  }
}
