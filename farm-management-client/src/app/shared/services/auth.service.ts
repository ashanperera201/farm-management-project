import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserModel } from '../models/user-model';
import { changePasswordModel, loginUserModel } from '../models/login-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/get-all`;
    return this.http.get(url);
  }

  authenticateUser(user: loginUserModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/sign-in`;
    return this.http.post(url, user);
  }

  registerUser(userData: UserModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/sign-up`;
    return this.http.post(url, userData)
  }

  resetPassword(userData: changePasswordModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/user-manager/change-password`;
    return this.http.post(url, userData)
  }
}
