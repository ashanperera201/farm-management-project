import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ExportTypes } from '../../../shared/enums/export-type';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { FileService } from '../../../shared/services/file.service';
import { RoleAddComponent } from '../role-add/role-add.component';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  exportTypes = ExportTypes;
  roleList: any[] = [];
  tempRoleList: any[] = [];
  userRoleSubscriptions: Subscription[] = [];
  searchParam!: string;
  isAllChecked!: boolean;

  pageSize: number = 10;
  page: any = 1;

  constructor(
    private userManagementService: UserManagementService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fetchUserRoles();
  }

  fetchUserRoles = () => {
    this.blockUI.start('Fetching data....');
    this.userManagementService.fetchRoleList().subscribe(res => {
      if (res && res.result) {
        this.roleList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Roles", "Error");
      this.blockUI.stop();
    });
  }

  addNewRole = () => {
    const addRoleModal = this.modalService.open(RoleAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });

    if (addRoleModal.componentInstance.roleAfterSave) {
      this.userRoleSubscriptions.push(addRoleModal.componentInstance.roleAfterSave.subscribe((serviceResponse: any) => {
        if (serviceResponse) {
          this.roleList = [...this.roleList, serviceResponse.result].sort((a, b) => this.getTime(new Date(b.createdOn)) - this.getTime(new Date(a.createdOn)));
        }
      }))
    }
  }

  private getTime = (date?: Date) => {
    return date ? date.getTime() : 0;
  }

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const roleIds: string[] = (this.roleList.filter(x => x.isChecked === true)).map(x => x._id);
    if (roleIds && roleIds.length > 0) {
      this.proceedDelete(roleIds);
    } else {
      this.toastrService.error("Please select roles to delete.", "Error");
      this.blockUI.stop();
    }
  }

  deleteRole = (roleId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(roleId));
  }

  proceedDelete = (roleIds: string[]) => {
    let form = new FormData();
    form.append("roleIds", JSON.stringify(roleIds));

    this.userRoleSubscriptions.push(this.userManagementService.deleteRoles(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        roleIds.forEach(e => {
          const index: number = this.roleList.findIndex((up: any) => up._id === e);
          this.roleList.splice(index, 1);
        });
        this.isAllChecked = false;
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }

  onSelectionChange = () => {
    if (this.isAllChecked) {
      this.roleList = this.roleList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.roleList = this.roleList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.roleList[index].isChecked = !this.roleList[index].isChecked;
  }

  updateRole = (role: any) => {
    const updateRoleModalRef = this.modalService.open(RoleAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updateRoleModalRef.componentInstance.role = role;
    updateRoleModalRef.componentInstance.isEditMode = true;

    if (updateRoleModalRef.componentInstance.roleAfterSave) {
      this.userRoleSubscriptions.push(updateRoleModalRef.componentInstance.roleAfterSave.subscribe((res: any) => {
        if (res) {
          this.roleList.map(r => r._id === res._id ? {
            ...r,
            roleCode: r.roleCode,
            roleName: r.roleName,
            roleDescription: r.roleDescription,
            permissions: r.permissions
          } : r);
        }
      }))
    }
  }

  exportRoleList = (type: any) => {
    if (type === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      const roleList: any[] = this.roleList.map(x => {
        return {
          role_code: x.roleCode,
          role_description: x.roleDescription,
          role_name: x.roleName,
          created_by: x.createdBy,
          created_date: x.createdOn,
          modified_by: x.modifiedBy,
          modified_on: x.modifiedOn

        }
      });
      this.fileService.exportAsExcelFile(roleList, "roles-file");
      this.blockUI.stop();
    }
    else {
      this.blockUI.start('Exporting Pdf...');
      const roleList: any[] = this.roleList.map(x => {
        return {
          role_code: x.roleCode.toLowerCase(),
          role_description: x.roleDescription.toLowerCase(),
          role_name: x.roleName.toLowerCase(),
          created_by: x.createdBy.toLowerCase(),
          created_date: moment(x.createdOn).format('YYYY-MM-DD'),
          modified_by: x.modifiedBy ? x.modifiedBy.toLowerCase() : '-',
          modified_on: x.modifiedOn ? moment(x.modifiedOn).format('YYYY-MM-DD') : "-"
        }
      });
      const headers: any[] = ['role_code', 'role_description', 'role_name', 'created_by', 'created_date', 'modified_by', 'modified_on'];
      this.fileService.exportToPDF("Feed Brand", headers, roleList, 'user_roles');
      this.blockUI.stop();
    }
  }

  ngOnDestroy() {
    if (this.userRoleSubscriptions && this.userRoleSubscriptions.length > 0) {
      this.userRoleSubscriptions.forEach(s => {
        s.unsubscribe();
      });
    }
  }
}
