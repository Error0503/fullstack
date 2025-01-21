import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../services/ClientService/client-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage?: string;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  submitForm() {
    this.submitted = true;
    this.errorMessage = undefined;
    this.clientService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.submitted = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        this.submitted = false;
        if (error.error.statusCode === 401) {
          this.errorMessage = 'Invalid credentials';
        } else if (error.error.statusCode === 409) {
          this.errorMessage = 'Username already taken';
        } else if (error.error.statusCode === 500) {
          this.errorMessage = 'Internal server error';
        } else {
          this.errorMessage = 'An error occurred';
        }
      },
    });
  }
}
