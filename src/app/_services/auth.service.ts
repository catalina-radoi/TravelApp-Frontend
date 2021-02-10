import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '.././@types/User';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) {

  }



  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      userName: credentials.userName,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      password: user.password
    }, httpOptions);
  }
}
