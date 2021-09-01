import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { UserManagementComponent } from './user-management.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserPermissionsComponent } from './user-permissions/user-permissions.component';
import { UserManagementRoutingModule } from './user-management.routing';
import { RoleAddComponent } from './role-add/role-add.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserPermissionAddComponent } from './user-permission-add/user-permission-add.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserAddComponent,
    UserListComponent,
    UserRolesComponent,
    UserPermissionsComponent,
    RoleAddComponent,
    UserPermissionAddComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModule,
    NgbPaginationModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule
  ]
})
export class UserManagementModule { }
