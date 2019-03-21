import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../users/user.model';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  private users: User[] = [];
  private usersUpdated = new Subject< {users: User[], userCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password };
    // console.log(authData)
    this .http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
         console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this .http
      .post< { token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        // console.log('response = ' + response.token);
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          // console.log(expirationDate);
          this.clearAuthData();
          this.saveAuthData(email, token, expirationDate);
          setTimeout(function () { }, 12000);
          this.isAuthenticated = true;
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    console.log('Prepare to login.');
    const authInformation = this .getAuthData();
    // console.log('authInformation ' + authInformation);
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
     console.log(authInformation, expiresIn);
    if ( expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      // console.log('logined');
      this.authStatusListener.next(true);
    }
  }

  getUsers(usersPerPage: number, currentPage: number) {
    // console.log('users.services was run.');
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this .http
      .get< { message: string; users: any; maxUsers: number }>(
        'http://localhost:3000/api/user' + queryParams
      )
      .pipe(
        map(userData => {
          return {
            users: userData.users.map(user => {
              return {
                id: user._id,
                email: user.email,
                password: user.password,
                role: user.role
              };
          }),
          maxUsers: userData.maxUsers
        };
      })
    )
    .subscribe(transformedUserData => {
      console.log(transformedUserData);
      this .users = transformedUserData.users;
      this .usersUpdated.next({
         users: [...this .users],
         userCount: transformedUserData.maxUsers
      });
    });
  }

  getUserUpdateListener() {
    return this .usersUpdated.asObservable();
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this .tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(userName: string, token: string, expirationDate: Date) {
    localStorage.setItem('userName', userName);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      userName: userName,
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  getUserById(id: string) {
    return this .http.get< {_id: string, email: string, password: string, role: number}>(
      'http://localhost:3000/api/user/' + id
    );
  }

  getUserByEmail(email: string) {
    return this .http.get< {_id: string, email: string, password: string, role: number}>(
      'http://localhost:3000/api/user/' + email
    );
  }

  deleteUser(id: string) {
    return this .http
      .delete( 'http://localhost:3000/api/posts/' + id);
  }
}
