import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRoleModel } from './../models/user-role-model';
import { environment } from '../../../environments/environment';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchUserList(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/get-all`;
    return this.http.get(url);
  }

  fetchRoleList(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/get-all`;
    return this.http.get(url);
  }

  fetchRole(roleId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/${roleId}`;
    return this.http.get(url)
  }

  fetchUser(userId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/${userId}`;
    return this.http.get(url)
  }

  addRole(roleData: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/create`;
    return this.http.post(url, roleData)
  }

  addUser(userData: UserModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/sign-up`;
    return this.http.post(url, userData)
  }

  fetchUserPermission(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/permission/get-all`;
    return this.http.get(url);
  }

  saveUserPermission(permission: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/permission/create`;
    return this.http.post(url, permission);
  }

  updateUserPermission = (permission: any) => {
    const url: string = `${this.baseUrl}/api/v1/permission/update`;
    return this.http.put(url, permission);
  }

  deleteUserPermission = (permissionIds: any) => {
    const url: string = `${this.baseUrl}/api/v1/permission/delete`;
    return this.http.post(url, permissionIds);
  }

  deleteRoles(roleDeleteForm: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/delete`;
    return this.http.post(url, roleDeleteForm);
  }

  updateRole(roleData: UserRoleModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/update`;
    return this.http.put(url, roleData)
  }

  deleteUser(userDelete: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/delete`;
    return this.http.post(url, userDelete);
  }

  updateUser(userData: UserModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/update`;
    return this.http.put(url, userData)
  }
}
