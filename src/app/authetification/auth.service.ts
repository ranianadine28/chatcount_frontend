import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { map } from 'rxjs/operators';
import { User } from './login/model_user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signUpUrl = environment.apiUrl;
  private loginUrl = environment.apiUrl;

  private currentUserSubject: BehaviorSubject<User | null>; // User or null if not logged in
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  signUp(formData: FormData): Observable<any> {
    // Include image data in the request body
    return this.http.post<any>(`${this.signUpUrl}/user/signup`, formData, { reportProgress: true, observe: 'events' });
  }
 
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/user/login`, { email, password })
      .pipe(
        map((user) => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return user;
        })
      );
  }
  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }
}
