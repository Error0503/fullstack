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
        'https://deadlock-builds-backend-9514acf001ce.herokuapp.com/auth/login',
        userInfo
      )
      .pipe(
        map((response) => {
          this.userService.saveToken(response.access_token);
          return response;
        })
      );
  }

  register(userInfo: {
    username: string;
    password: string;
  }): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(
        'https://deadlock-builds-backend-9514acf001ce.herokuapp.com/auth/register',
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
