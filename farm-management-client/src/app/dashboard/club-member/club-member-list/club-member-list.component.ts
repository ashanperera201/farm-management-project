import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { FileService } from '../../../shared/services/file.service';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { ClubMemberAddComponent } from '../club-member-add/club-member-add.component';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState, removeClubMember, setClubMember, updateClubMember } from '../../../redux';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';


@Component({
  selector: 'app-club-member-list',
  templateUrl: './club-member-list.component.html',
  styleUrls: ['./club-member-list.component.scss']
})
export class ClubMemberListComponent implements OnInit {

  clubMemberList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  memberListSubscriptions: Subscription[] = [];
  isAllChecked!: boolean;

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private clubMemberService: ClubMemberService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>,
    private customAlertService: CustomAlertService) { }

  ngOnInit(): void {
    this.fetchClubMembers();
  }

  fetchClubMembers = () => {
    this.blockUI.start('Fetching Club Members......');
    this.memberListSubscriptions.push(this.clubMemberService.fetchClubMembers().subscribe(res => {
      if (res && res.result) {
        this.clubMemberList = res.result;
        this.store.dispatch(setClubMember(res.result));
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Failed to load Club Members Data", "Error");
    }));
  }

  addNewClubMember = () => {
    const addClubMemberModal = this.modalService.open(ClubMemberAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addClubMemberModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res && res.clubMember) {
        this.clubMemberList = Object.assign([],this.clubMemberList)
        this.clubMemberList.unshift(res.clubMember);
      }
    });
  }

  updateClubMember = (clubMember: any) => {
    const addClubMemberModal = this.modalService.open(ClubMemberAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addClubMemberModal.componentInstance.existingClubMember = clubMember;
    addClubMemberModal.componentInstance.isEditMode = true;
    if (addClubMemberModal.componentInstance.afterSave) {
      addClubMemberModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          const index = this.clubMemberList.findIndex((up: any) => up._id === res._id);
          let clubMemberRefs = JSON.parse(JSON.stringify(this.clubMemberList));

          clubMemberRefs[index].firstName = res.firstName;
          clubMemberRefs[index].lastName = res.lastName;
          clubMemberRefs[index].email = res.email;
          clubMemberRefs[index].contactNumber = res.contactNumber;
          clubMemberRefs[index].address = res.address;
          clubMemberRefs[index].city = res.city;
          clubMemberRefs[index].userName = res.userName;
          clubMemberRefs[index].password = res.password;
          clubMemberRefs[index].nic = res.nic;

          this.clubMemberList = [...clubMemberRefs];
          // ** 
          this.store.dispatch(updateClubMember(this.clubMemberList[index]));
        }
      });
    }
  }

  deleteSelected = () => {
    const deleteModal = this.customAlertService.openDeleteconfirmation();
    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      const clubMemberIds: string[] = (this.clubMemberList.filter(x => x.isChecked === true)).map(x => x._id);
      if (clubMemberIds && clubMemberIds.length > 0) {
        this.proceedDelete(clubMemberIds);
      } else {
        this.toastrService.error("Please select items to delete.", "Error");
        this.blockUI.stop();
      }
      deleteModal.close();
    });
  }

  deleteClubMemberRecord = (clubMemberId: any) => {
    const deleteModal = this.customAlertService.openDeleteconfirmation();
    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      this.proceedDelete([].concat(clubMemberId));
      deleteModal.close();
    });
  }

  proceedDelete = (clubMemberIds: string[]) => {
    let form = new FormData();
    form.append("clubMemberIds", JSON.stringify(clubMemberIds));

    this.memberListSubscriptions.push(this.clubMemberService.deleteClubMember(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        this.blockUI.stop();
        clubMemberIds.forEach(e => { const index: number = this.clubMemberList.findIndex((up: any) => up._id === e); this.clubMemberList.splice(index, 1); });
        this.store.dispatch(removeClubMember(clubMemberIds));
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
      this.clubMemberList = this.clubMemberList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.clubMemberList = this.clubMemberList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.clubMemberList[index]['isChecked'] = !this.clubMemberList[index]['isChecked'];
  }

  exportClubMemberList = (type: any) => {
    if (type === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      const csvData: any[] = this.clubMemberList.map(x => {
        return {
          'First Name': x.firstName,
          'Last Name': x.lastName,
          'Email': x.email,
          'Contact No': x.contactNumber,
          'Address': x.address,
          'City': x.city,
          'Nic': x.nic,
          'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Club_Members_Data");
      this.blockUI.stop();
    }
    else {
      this.blockUI.start('Exporting Pdf...');
      const pdfData: any[] = this.clubMemberList.map(x => {
        return {
          'First Name': x.firstName,
          'Last Name': x.lastName,
          'Email': x.email,
          'Contact No': x.contactNumber,
          'Nic': x.nic,
          'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      const headers: any[] = ['First Name', 'Last Name', 'Email', 'Contact No', 'Nic', 'Created On',];
      this.fileService.exportToPDF("Club Members Data", headers, pdfData, 'Club_Members_Data');
      this.blockUI.stop();
    }
  }

  importClubMembers = () => {

  }

  ngOnDestroy() {
    if (this.memberListSubscriptions && this.memberListSubscriptions.length > 0) {
      this.memberListSubscriptions.forEach(res => {
        res.unsubscribe();
      })
    }
  }
}
