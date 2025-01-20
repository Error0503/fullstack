import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import Build from '../../../interfaces/build';
import heroesData from '../../../assets/heroes.json';

@Component({
  selector: 'app-build-viewer',
  standalone: true,
  imports: [],
  templateUrl: './build-viewer.component.html',
  styleUrl: './build-viewer.component.css',
})
export class BuildViewerComponent {
  buildData: Build | undefined;
  loading: boolean = true;
  heroes = Object.values(heroesData);

  @Input()
  set id(id: number) {
    this.http.get(`http://localhost:3000/post/${id}`).subscribe({
      next: (data) => {
        this.buildData = JSON.parse(JSON.stringify({ ...data }))[0];
      },
      error: console.error,
      complete: () => (this.loading = false),
    });
  }

  constructor(private http: HttpClient) {}
}
