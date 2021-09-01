import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { FileService } from '../../../shared/services/file.service';
import { ExportTypes } from '../../../shared/enums/export-type';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { UserPermissionAddComponent } from '../user-permission-add/user-permission-add.component';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;
  userPermissionList!: any[];
  exportTypes = ExportTypes;
  isAllChecked: boolean = false;
  userPermissionSubscriptions: Subscription[] = [];

  pageSize: number = 10;
  page: any = 1;

  constructor(
    private userManagementService: UserManagementService,
    private modalService: NgbModal,
    private fileService: FileService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.fetchUserPermission();
  }

  fetchUserPermission = () => {
    this.blockUI.start('Fetching Data...');
    this.userPermissionSubscriptions.push(this.userManagementService.fetchUserPermission().subscribe(userPermissionResult => {
      if (userPermissionResult && userPermissionResult.validity) {
        this.userPermissionList = userPermissionResult.result;
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    }))
  }

  addPermission = () => {
    const userPermissionAdd = this.modalService.open(UserPermissionAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });

    if (userPermissionAdd.componentInstance.afterSave) {
      this.userPermissionSubscriptions.push(userPermissionAdd.componentInstance.afterSave.subscribe((serviceResponse: any) => {
        if (serviceResponse && serviceResponse.result) {
          this.userPermissionList = [...this.userPermissionList, serviceResponse.result].sort((a, b) => this.getTime(new Date(b.createdOn)) - this.getTime(new Date(a.createdOn)));
        }
      }));
    }
  }

  private getTime = (date?: Date) => {
    return date ? date.getTime() : 0;
  }


  exportData = (fileType: number) => {
    if (fileType === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      this.fileService.exportAsExcelFile(this.userPermissionList, "user-permissions");
      this.blockUI.stop();
    } else {
      this.blockUI.start('Exporting Pdf...');
      const permissionList: any[] = this.userPermissionList.map(x => {
        return {
          permissionCode: x.permissionCode.toLowerCase(),
          permissionName: x.permissionName.toLowerCase(),
          permissionDescription: x.permissionDescription.toLowerCase(),
          createdBy: x.createdBy,
          createdOn: moment(x.createdOn).format('YYYY-MM-DD'),
          modifiedBy: x.modifiedBy ? x.modifiedBy : '-',
          modifiedOn: x.modifiedOn ? moment(x.modifiedOn).format('YYYY-MM-DD') : "-"
        }
      });
      const headers: any[] = ['permissionCode', 'permissionName', 'permissionDescription', 'createdBy', 'createdOn', 'modifiedBy', 'modifiedOn'];
      this.fileService.exportToPDF("User Permissions", headers, permissionList, "permission-list");
      this.blockUI.stop();
    }
  }

  updatePermission = (permission: any) => {
    const userPermissionUpdate = this.modalService.open(UserPermissionAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });

    userPermissionUpdate.componentInstance.existingRecord = permission;
    if (userPermissionUpdate.componentInstance.afterSave) {
      this.userPermissionSubscriptions.push(userPermissionUpdate.componentInstance.afterSave.subscribe((result: any) => {
        if (result) {
          this.userPermissionList.map((up: any) => up._id === result._id ?
            { ...up, permissionCode: result.permissionCode, permissionName: result.permissionName, permissionDescription: result.permissionDescription } :
            up);
        }
      }));
    }
  }

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const permissionIds: string[] = (this.userPermissionList.filter(x => x.isChecked === true)).map(x => x._id);
    if (permissionIds && permissionIds.length > 0) {
      this.proceedDelete(permissionIds);
    } else {
      this.toastrService.error("Please select permissions to delete.", "Error");
      this.blockUI.stop();
    }
  }

  deletePermission = (permissionId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(permissionId));
  }

  proceedDelete = (permissionIds: string[]) => {
    let form = new FormData();
    form.append("permissionIds", JSON.stringify(permissionIds));

    this.userPermissionSubscriptions.push(this.userManagementService.deleteUserPermission(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        permissionIds.forEach(e => {
          const index: number = this.userPermissionList.findIndex((up: any) => up._id === e);
          this.userPermissionList.splice(index, 1);
        })

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
      this.userPermissionList = this.userPermissionList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.userPermissionList = this.userPermissionList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.userPermissionList[index].isChecked = !this.userPermissionList[index].isChecked;
  }

  ngOnDestroy() {
    if (this.userPermissionSubscriptions && this.userPermissionSubscriptions.length > 0) {
      this.userPermissionSubscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }
}
