import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/ClientService/client-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submitForm(event: Event) {
    console.log(this.loginForm.value);
    this.clientService.login(this.loginForm.value).subscribe((response) => {
      console.log('here');
    });
  }
}
