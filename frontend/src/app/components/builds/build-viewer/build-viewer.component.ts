import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import Build from '../../../interfaces/build';
import heroesData from '../../../assets/heroes.json';
import { UserService } from '../../../services/UserService/user-service.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

enum Reasons {
  OFFENSIVE = 'offensive',
  SPAM = 'spam',
  MISLEADING = 'misleading',
}
@Component({
  selector: 'app-build-viewer',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './build-viewer.component.html',
  styleUrl: './build-viewer.component.css',
})
export class BuildViewerComponent {
  buildData: Build | undefined;
  loading: boolean = true;
  heroes = Object.values(heroesData);
  reportForm: FormGroup;
  reasons = Object.values(Reasons);
  errorMessage?: string;
  userService: UserService;

  @Input()
  set id(id: number) {
    this.http.get(`http://localhost:3000/post/${id}`).subscribe({
      next: (data) => {
        this.buildData = JSON.parse(JSON.stringify({ ...data }));
      },
      error: console.error,
      complete: () => (this.loading = false),
    });
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    userService: UserService,
    private router: Router
  ) {
    this.userService = userService;
    this.reportForm = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(10)]],
      reason: [
        'Select an option',
        [
          Validators.required,
          Validators.pattern(Object.values(Reasons).join('|')),
        ],
      ],
    });
  }

  get body() {
    return this.reportForm.get('body');
  }

  get reason() {
    return this.reportForm.get('reason');
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

  reportBuild(e: any) {
    e.preventDefault();
    this.http
      .post(`http://localhost:3000/report`, {
        body: this.reportForm.value.body,
        reason: this.reportForm.value.reason,
        userId: this.userService.getUserId(),
        postId: this.buildData?.id,
      })
      .subscribe({
        error: (error) => {
          if (error.error.statusCode === 500) {
            this.errorMessage = 'Internal server error';
          } else if (error.error.statusCode === 400) {
            this.errorMessage = 'Invalid report';
          } else {
            this.errorMessage = 'An error occurred';
          }
        },

        complete: () => {
          this.reportForm.reset({
            body: '',
            reason: 'Select an option',
          });
          this.closeModal();
          this.errorMessage = undefined;
        },
      });
  }

  closeModal() {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }
}
