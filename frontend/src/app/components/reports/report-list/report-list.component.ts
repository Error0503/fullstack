import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Report from '../../../interfaces/report';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list-component',
  standalone: true,
  imports: [],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css',
})
export class ReportListComponent {
  reports: Report[];
  loading: boolean = true;
  filter: boolean = true;

  constructor(private http: HttpClient, private router: Router) {
    this.reports = [];
    this.refresh();
  }

  toggle() {
    this.filter = !this.filter;
    this.refresh();
  }

  refresh() {
    let url: string =
      'https://deadlock-builds-backend-9514acf001ce.herokuapp.com/report';
    if (this.filter) {
      url += '?status=open';
    }
    this.http.get(url).subscribe({
      next: (data) => {
        this.loading = true;
        this.reports = JSON.parse(JSON.stringify(data));
      },
      error: console.error,
      complete: () => (this.loading = false),
    });
  }

  viewReport(index: number) {
    if (this.reports[index].status === 'resolved') {
      this.router.navigate(['/reports', this.reports[index].id]);
    } else {
      this.http
        .put(
          `https://deadlock-builds-backend-9514acf001ce.herokuapp.com/report/${this.reports[index].id}`,
          { status: 'in-progress' }
        )
        .subscribe({
          complete: () =>
            this.router.navigate(['/reports', this.reports[index].id]),
        });
    }
  }
}
