import { Component, Input, OnInit } from '@angular/core';
import User from '../../interfaces/user';
import { UserService } from '../../services/UserService/user-service.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css',
})
export class ProfileEditComponent implements OnInit {
  user: User | undefined;
  num: number = 0;
  editForm: FormGroup;

  @Input()
  set id(id: number) {
    this.getUserData(id);
    this.num = id;
  }

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.getDecodedAccessToken();
    this.editForm = this.fb.group({
      username: [this.user?.username, [Validators.required]],
      oldPassword: ['', []],
      newPassword: ['', []],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.num != this.user?.id) {
      this.router.navigate(['/']);
      return;
    }
  }

  get username() {
    return this.editForm.get('username');
  }

  get oldPassword() {
    return this.editForm.get('oldPassword');
  }

  get newPassword() {
    return this.editForm.get('newPassword');
  }

  getDecodedAccessToken(): void {
    const token = this.userService.getToken();

    if (!token) {
      return;
    }

    try {
      this.user = jwtDecode(token);
    } catch (Error) {
      console.error(Error);
      return;
    }
  }

  getUserData(id: number): void {
    this.http.get(`http://localhost:3000/user/?id=${id}`).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user posts:', error);
        this.router.navigate(['/']);
      }
    );
  }

  updateUserData(username: string, password?: string): void {
    this.http
      .put(`http://localhost:3000/user/${this.user?.id}`, {
        username,
        password,
      })
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  submitForm(): void {
    if (Date.now() - new Date(this.user!.updatedAt).getTime() < 86400000) {
      console.log('Cannot change data yet');
      // return;
    }

    if (!(this.editForm.valid && this.checkPassword())) {
      return;
    }



    this.updateUserData(this.username!.value, this.newPassword?.value ? this.newPassword?.value : undefined);
    console.log('submitting form');
  }

  checkPassword(): boolean {
    if (
      (this.oldPassword?.value === '' && this.newPassword?.value === '') ||
      (this.oldPassword?.value !== '' && this.newPassword?.value === '')
    ) {
      return true;
    }

    if (this.newPassword?.value !== '' && this.oldPassword?.value === '') {
      this.oldPassword?.setErrors({ required: true });
      return false;
    }

    if (!bcrypt.compareSync(this.oldPassword?.value, this.user!.password)) {
      this.oldPassword?.setErrors({ incorrect: true });
      return false;
    }

    this.oldPassword?.setErrors(null);
    return true;
  }
}
