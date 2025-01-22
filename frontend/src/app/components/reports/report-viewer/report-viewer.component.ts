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
    this.http.get(`https://deadlock-builds-backend-9514acf001ce.herokuapp.com/report/${id}`).subscribe({
      next: (data) => {
        this.reportData = JSON.parse(JSON.stringify(data));
      },
      complete: () => {
        this.fetchBuild(this.reportData?.post.id);
      },
    });
  }

  private fetchBuild(id: number | undefined) {
    if (id !== undefined) {
      this.http.get(`https://deadlock-builds-backend-9514acf001ce.herokuapp.com/post/${id}`).subscribe({
        next: (data) => {
          this.buildData = JSON.parse(JSON.stringify({ ...data }));
        },
        error: console.error,
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  deleteBuild() {
    this.http
      .delete(`https://deadlock-builds-backend-9514acf001ce.herokuapp.com/post/${this.buildData?.id}`)
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
      .put(`https://deadlock-builds-backend-9514acf001ce.herokuapp.com/report/${this.reportData?.id}`, {
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
