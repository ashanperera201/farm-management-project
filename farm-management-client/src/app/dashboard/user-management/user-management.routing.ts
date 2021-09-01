import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserPermissionsComponent } from './user-permissions/user-permissions.component';

const routes: Routes = [
    {
        path: '', component: UserManagementComponent,
        children: [
            { path: 'view-users', redirectTo: 'view-users', pathMatch: 'full' },
            { path: 'view-users', component: UserListComponent },
            { path: 'user-add', component: UserAddComponent },
            { path: 'view-roles', component: UserRolesComponent },
            { path: 'view-permissions', component: UserPermissionsComponent },
            { path: '**', redirectTo: 'view-users' }
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserManagementRoutingModule { }
