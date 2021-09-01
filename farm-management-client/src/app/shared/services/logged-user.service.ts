import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenManagementService } from './token-management.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {

  private userDetails!: any;

  constructor(private tokenManagementService: TokenManagementService, private router: Router) { }

  setUserDetails = (userDetails: any) => {
    this.userDetails = userDetails;
  }

  getUserRoles = (): string[] => {
    let roles: string[] = [];
    if (this.userDetails) {
      roles = this.userDetails.roles.map((x: any) => x.roleCode);
    }
    return roles;
  }

  getLoggedUserId = () => {
    let userId: string = "";
    if (this.userDetails) { 
      userId = this.userDetails.userId;
    }
    return userId;
  }

  isUserLoggedIn = (): boolean => {
    return !!this.tokenManagementService.getItem();
  }

  signOut = () => {
    this.tokenManagementService.removeTokenItem();
    this.router.navigate(['/auth'])
  }

}
