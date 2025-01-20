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
import User from '../../../interfaces/user';
import { Observable, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-build-viewer',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './build-viewer.component.html',
  styleUrl: './build-viewer.component.css',
})
export class BuildViewerComponent {
  buildData: Build | undefined;
  loading: boolean = true;
  heroes = Object.values(heroesData);

  userService: UserService;

  commentForm: FormGroup;

  @Input()
  set id(id: number) {
    this.fetchData(id);
  }

  constructor(
    private http: HttpClient,
    userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.userService = userService;
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required]],
    });
  }

  private fetchData(id: number) {
    this.http.get(`http://localhost:3000/post/${id}`).subscribe({
      next: (data) => {
        this.buildData = JSON.parse(JSON.stringify({ ...data }));
        console.log(this.buildData);
      },
      error: console.error,
      complete: () => (this.loading = false),
    });
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

  saveComment() {
    this.http
      .post(`http://localhost:3000/comment`, {
        postId: this.buildData?.id,
        userId: this.userService.getUserId(),
        commenterUsername: this.userService.getUsername(),
        content: this.commentForm.value.content,
      })
      .subscribe({
        error: console.error,
        complete: () => {
          this.fetchData(this.buildData!.id);
          this.commentForm.reset();
        },
      });
  }

  deleteComment(commentId: number) {
    this.http
      .delete(`http://localhost:3000/comment/${commentId}`)
      .subscribe({ complete: () => this.fetchData(this.buildData!.id) });
  }

  convertToDate(date: Date) {
    const convertedDate = new Date(date);
    return (
      convertedDate.toLocaleDateString() +
      ' ' +
      convertedDate.toLocaleTimeString()
    );
  }
}
