import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserRoleModel } from '../../../shared/models/user-role-model';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { RolePermissionService } from '../../../shared/services/role-permission.service';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() role: any;
  @Output() roleAfterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  addRoleForm!: FormGroup;
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Role';
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private userManagementService: UserManagementService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private rolePermissionService: RolePermissionService) { }

  ngOnInit(): void {
    this.initRoleForm();
    this.configMultiDropdown();
    this.fetchRolePermissionData();
  }

  configMultiDropdown = () => {
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'permissionName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  initRoleForm = () => {
    this.addRoleForm = new FormGroup({
      roleCode: new FormControl(null, Validators.compose([Validators.required])),
      roleDescription: new FormControl(null),
      permissions: new FormControl(null)
    });
  }

  patchExistsRole = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Role";

      let selectedPermissions: any[] = [];

      this.role.permissions.forEach((p: any) => {
        const permission: any = this.dropdownList.find((dp: any) => dp._id === p);
        if (permission) {
          selectedPermissions.push({ _id: permission._id, permissionName: permission.permissionName });
        }
      });
      const rolePatchForm = {
        roleCode: this.role.roleCode,
        roleDescription: this.role.roleDescription,
        permissions: selectedPermissions,
      }

      this.addRoleForm.patchValue(rolePatchForm);
    }
  }

  addRole = () => {
    this.blockUI.start('Processing.....');
    if (this.addRoleForm.valid) {
      if (this.isEditMode) {
        this.role.roleCode = this.addRoleForm.value.roleCode;;
        this.role.roleName = this.addRoleForm.value.roleCode;
        this.role.roleDescription = this.addRoleForm.value.roleDescription;
        this.role.permissions = [].concat((this.addRoleForm.get("permissions")?.value).map((x: any) => x._id));
        this.userManagementService.updateRole(this.role).subscribe(res => {
          if (res) {
            this.toastrService.success("Role updated successfully", "Success");
            this.clearRoleForm();
            this.closeModal();
            this.roleAfterSave.emit(this.role);
          }
          this.blockUI.stop();
        }, ({ error }) => {
          this.toastrService.error(error.error, "Error");
          this.blockUI.stop();
        });
      }
      else {
        const userRole = new UserRoleModel();
        userRole.roleCode = this.addRoleForm.value.roleCode;
        userRole.roleName = this.addRoleForm.value.roleCode;
        userRole.roleDescription = this.addRoleForm.value.roleDescription;
        userRole.permissions = [].concat((this.addRoleForm.get("permissions")?.value).map((x: any) => x._id));

        this.userManagementService.addRole(userRole).subscribe(res => {
          if (res && res.validity) {
            this.toastrService.success("Role saved successfully", "Success");
            this.clearRoleForm();
            this.closeModal();
            this.roleAfterSave.emit(res);
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Unable to save Role", "Error");
          this.blockUI.stop();
        });
      }
    } else {
      this.blockUI.stop();
    }
  }

  clearRoleForm = () => {
    this.addRoleForm.reset();
  }

  closeModal = () => {
    this.activeModal.close();
  }

  fetchRolePermissionData = () => {
    this.blockUI.start('Fetching...');
    this.rolePermissionService.fetchPermissionList().subscribe(res => {
      if (res) {
        this.dropdownList = res.result;
        this.patchExistsRole();
      }
      const servTimer = setTimeout(() => {
        this.blockUI.stop();
        clearTimeout(servTimer);
      }, 500);
    }, () => {
      this.blockUI.stop();
    });
  }

}
