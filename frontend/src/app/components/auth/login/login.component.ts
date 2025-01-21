import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../services/ClientService/client-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage?: string;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submitForm() {
    this.submitted = true;
    this.errorMessage = undefined;
    this.clientService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.submitted = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        this.submitted = false;
        if (error.error.statusCode === 401) {
          this.errorMessage = 'Invalid username or password';
        } else if (error.error.statusCode === 500) {
          this.errorMessage = 'Internal server error';
        } else {
          this.errorMessage = 'An error occurred';
        }
      },
    });
  }
}
