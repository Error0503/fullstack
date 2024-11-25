import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserService } from '../UserService/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient, private userService: UserService) {}

  login(userInfo: {
    username: string;
    password: string;
  }): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(
        'http://localhost:3000/auth/login',
        userInfo
      )
      .pipe(
        map((response) => {
          this.userService.saveToken(response.access_token);
          return response;
        })
      );
  }
}
