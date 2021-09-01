import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { UserModel } from './../../../shared/models/user-model';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { AuthService } from '../../../shared/services/auth.service';
import { keyPressNumbers } from '../../../shared/utils';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit, OnDestroy {

  @Input() isEditMode: boolean = false;
  @Input() existingUser: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  addUserForm!: FormGroup;
  saveButtonText: string = 'Submit';
  headerText: string = 'Register User';
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {};
  userSubscription: Subscription[] = [];

  constructor(
    private userManagementService: UserManagementService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddUserForm();
    this.configValues();
    this.fetchUserRoles();
  }

  initAddUserForm = () => {
    this.addUserForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      userEmail: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      firstName: new FormControl(null, Validators.compose([Validators.required])),
      middleName: new FormControl(null),
      lastName: new FormControl(null, Validators.compose([Validators.required])),
      contact: new FormControl(null, Validators.compose([Validators.required])),
      userAddress: new FormControl(null, Validators.compose([Validators.required])),
      nic: new FormControl(null, Validators.compose([Validators.required])),
      passpordId: new FormControl(null),
      roles: new FormControl(null),
      password: new FormControl(null),
      confirmPassword: new FormControl(null)
    });

    if (!this.isEditMode) {
      this.addUserForm.get("password")?.setValidators(Validators.compose([Validators.required]));
      this.addUserForm.get("confirmPassword")?.setValidators(Validators.compose([Validators.required]));
    }
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update User";
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'roleName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  setExistingUser = () => {
    let selectedRoles: any[] = [];
    if (this.existingUser && this.existingUser.roles && this.existingUser.roles.length > 0) {
      this.existingUser.roles.forEach((p: any) => {
        const role: any = this.dropdownList.find((dp: any) => dp._id === p);
        if (role) {
          selectedRoles.push({ _id: role._id, roleName: role.roleName });
        }
      });
    }

    const userForm = {
      userName: this.existingUser.userName,
      userEmail: this.existingUser.userEmail,
      firstName: this.existingUser.firstName,
      middleName: this.existingUser.middleName,
      lastName: this.existingUser.lastName,
      contact: this.existingUser.contact,
      userAddress: this.existingUser.userAddress,
      nic: this.existingUser.nic,
      passpordId: this.existingUser.passpordId,
      roles: selectedRoles,
    }

    this.addUserForm.patchValue(userForm);
  }

  userSaveUpdate = () => {
    this.blockUI.start('Processing....');
    if (this.addUserForm.valid) {
      if (this.isEditMode) {
        const roles = this.addUserForm.get("roles")?.value;

        this.existingUser.userName = (this.addUserForm.value.userName).trim();
        this.existingUser.userEmail = (this.addUserForm.value.userEmail).trim();
        this.existingUser.password = this.addUserForm.value.password ? (this.addUserForm.value.password).trim() : '';
        this.existingUser.firstName = (this.addUserForm.value.firstName).trim();
        this.existingUser.middleName = this.addUserForm.value.middleName ? (this.addUserForm.value.middleName).trim() : '';
        this.existingUser.lastName = (this.addUserForm.value.lastName).trim();
        this.existingUser.contact = (this.addUserForm.value.contact).trim();
        this.existingUser.userAddress = (this.addUserForm.value.userAddress).trim();
        this.existingUser.nic = this.addUserForm.value.nic.trim();
        this.existingUser.passportId = this.addUserForm.value.passpordId ? (this.addUserForm.value.passpordId).trim() : '';
        this.existingUser.profileImage = "";
        this.existingUser.roles = roles && roles.length > 0 ? [].concat((roles).map((x: any) => x._id)) : [];

        this.userSubscription.push(this.userManagementService.updateUser({ ...this.existingUser }).subscribe(res => {
          if (res) {
            this.toastrService.success("User updated successfully.", "Success");
            this.clearAddUserForm();
            this.closeModal();
            this.afterSave.emit(this.existingUser);
          }
          this.blockUI.stop();
        },
          () => {
            this.toastrService.error("Unable to update user", "Error");
            this.blockUI.stop();
          }));
      } else {
        if (this.checkPasswords(this.addUserForm.value)) {
          let userModelData = new UserModel();
          const roles = this.addUserForm.get("roles")?.value;
          userModelData.userName = (this.addUserForm.value.userName).trim();
          userModelData.userEmail = (this.addUserForm.value.userEmail).trim();
          userModelData.password = (this.addUserForm.value.password).trim();
          userModelData.firstName = (this.addUserForm.value.firstName).trim();
          userModelData.middleName = this.addUserForm.value.middleName ? (this.addUserForm.value.middleName).trim() : '';
          userModelData.lastName = (this.addUserForm.value.lastName).trim();
          userModelData.contact = (this.addUserForm.value.contact).trim();
          userModelData.userAddress = (this.addUserForm.value.userAddress).trim();
          userModelData.nic = this.addUserForm.value.nic.trim();
          userModelData.passportId = this.addUserForm.value.passpordId ? (this.addUserForm.value.passpordId).trim() : '';
          userModelData.profileImage = "";
          userModelData.roles = roles && roles.length > 0 ? [].concat((roles).map((x: any) => x._id)) : [];

          this.userSubscription.push(this.authService.registerUser(userModelData).subscribe(res => {
            if (res) {
              this.toastrService.success("User registered successfully.", "Success");
              this.clearAddUserForm();
              this.closeModal();
              this.afterSave.emit(res);
            }
            this.blockUI.stop();
          },
            () => {
              this.toastrService.error("Unable to save user", "Error");
              this.blockUI.stop();
            }));
        }
        else {
          this.toastrService.error("Re-entered password do not match", "Error");
          this.blockUI.stop();
        }
      }
    } else {
      this.blockUI.stop();
    }
  }

  checkPasswords = (formData: { password: any; confirmPassword: any; }) => {
    let result: boolean;
    result = formData.password == formData.confirmPassword ? true : false;
    return result;
  }

  fetchUserRoles = () => {
    this.userSubscription.push(this.userManagementService.fetchRoleList().subscribe(res => {
      if (res && res.result) {
        this.dropdownList = res.result;
        this.setExistingUser();
      }
    }, () => {
      this.toastrService.error("Failed to load users", "Error");
    }));
  }
  
  clearAddUserForm = () => {
    this.addUserForm.reset();
  }

  closeModal = () => {
    this.activeModal.close();
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  ngOnDestroy() {
    if (this.userSubscription && this.userSubscription.length > 0) {
      this.userSubscription.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
