import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import User from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  STORAGE_KEY = 'sessionToken';
  isLoggedIn: boolean = !!this.getToken();

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isLoggedIn = false;
  }

  saveToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
    this.isLoggedIn = true;
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) {
      return 0;
    }

    try {
      const user: User = jwtDecode(token);

      return user.id;
    } catch (Error) {
      console.error(Error);
      return 0;
    }
  }

  getUsername(): string {
    const token = this.getToken();
    if (!token) {
      return '';
    }

    try {
      const user: User = jwtDecode(token);

      return user.username;
    } catch (Error) {
      console.error(Error);
      return '';
    }
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) {
      return '';
    }

    try {
      const user: User = jwtDecode(token);

      return user.role;
    } catch (Error) {
      console.error(Error);
      return '';
    }
  }
}
