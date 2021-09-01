import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { AppState, setUserInformation } from '../redux'
import { TokenManagementService } from '../shared/services/token-management.service';
import { UserManagementService } from '../shared/services/user-management.service';
import { LoggedUserService } from '../shared/services/logged-user.service';

@Injectable({
    providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {


    private userDetails!: any;

    constructor(
        private tokenManagementService: TokenManagementService,
        private router: Router,
        private store: Store<AppState>,
        private userManagementService: UserManagementService,
        private loggedUserService: LoggedUserService,
        private ngxPermissionsService: NgxPermissionsService) {
    }

    canActivate(): Observable<boolean> {
        return new Observable(obs => {
            const userId = this.tokenManagementService.getUserId();
            if (userId) {
                this.authenticateUser(obs, userId);
            } else {
                this.router.navigate(['/auth/login']);
                obs.next(false);
                obs.complete();
            }
        })
    }

    authenticateUser = (obs: any, userId: string) => {
        const isAuthenticated = !!this.tokenManagementService.getItem();
        const isExpired: boolean = this.tokenManagementService.isTokenExpired();

        if (isAuthenticated && !isExpired) {
            this.userManagementService.fetchUser(userId).subscribe((userResult: any) => {
                if (userResult && userResult.validity) {
                    this.userDetails = userResult.result[0];

                    // SET USER DETAILS AND PERMISSION.
                    this.loggedUserService.setUserDetails(this.userDetails);
                    this.setUserPermissions();

                    // DISPATCH TO THE STORE.
                    this.store.dispatch(setUserInformation(this.userDetails));
                    obs.next(true);
                    obs.complete();
                }
            }, () => {
                obs.next(false);
                obs.error();
                obs.complete();
            });
        } else {
            this.tokenManagementService.removeTokenItem();
            this.router.navigate(['/auth/login']);
            obs.next(false);
            obs.complete();
        }
    }

    setUserPermissions = () => {
        let permissions: string[] = [];
        if (this.userDetails && this.userDetails.roles && this.userDetails.roles.length > 0) {
            const userPermissionSets: Array<any> = this.userDetails.roles.map((x: any) => x.permissions);
            userPermissionSets.forEach(permission => {
                if (permission) {
                    const permissionCodes: string[] = permission.map((p: any) => p.permissionCode);
                    permissions = permissions.concat(permissionCodes);
                }
            });
            let uniquePermisisonSets = [...new Set(permissions)];
            this.ngxPermissionsService.loadPermissions(uniquePermisisonSets);
        }
    }
}
