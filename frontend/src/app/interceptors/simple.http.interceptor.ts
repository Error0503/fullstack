import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UserService } from '../services/UserService/user-service.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SimpleHttpInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Modify the request
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.userService.getToken()}`,
      },
    });

    return next.handle(clonedRequest).pipe(
      tap((r) => {
        console.log('r', r);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 500) {
          console.log('Server error occured!');
        }

        return throwError(() => error);
      })
    );
  }
}
