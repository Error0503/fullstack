import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Report from '../../../interfaces/report';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-report-list-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css',
})
export class ReportListComponent {
  reports: Report[];
  loading: boolean = true;
  filter: boolean = true;

  constructor(private http: HttpClient) {
    this.reports = [];
    this.refresh();
  }

  toggle() {
    this.filter = !this.filter;
    this.refresh();
  }

  refresh() {
    let url: string = 'http://localhost:3000/report';
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
}
