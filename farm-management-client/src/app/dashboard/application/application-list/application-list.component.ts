import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ApplicationsService } from '../../../../app/shared/services/applications.service';
import { ApplicationAddComponent } from '../application-add/application-add.component';
import { FileService } from '../../../shared/services/file.service';
import { Store } from '@ngrx/store';
import { AppState, removeApplication, setApplication, updateApplication } from '../../../redux';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  
  @BlockUI() blockUI!: NgBlockUI;

  isAllChecked! : boolean;
  applicationList : any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  appListSubscriptions: Subscription[] = [];
  
  constructor(
    private applicationService : ApplicationsService,
    private toastrService:ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>) { }

 ngOnInit(): void {
  this.fetchApplicationsList();
}

fetchApplicationsList = () => {
  this.blockUI.start('Fetching Applications......');
  this.appListSubscriptions.push(this.applicationService.fetchApplications().subscribe(res=> {
    if(res && res.result){
      this.applicationList = res.result;
      this.store.dispatch(setApplication(res.result));
    }
    this.blockUI.stop();
  }, () => {
    this.toastrService.error("Failed to load Application Data","Error");
    this.blockUI.stop();
  }));
}

 addNewApplication = () => {
  const addApplicationModal = this.modalService.open(ApplicationAddComponent, {
    animation: true,
    keyboard: true,
    backdrop: true,
    modalDialogClass: 'modal-md',
  });
  if (addApplicationModal.componentInstance.afterSave) {
    addApplicationModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res && res.applications) {
        this.applicationList.unshift(res.applications);
      }
    })
  }
 }

 updateApplication = (application: any) => {
  const addFeedBrandModal = this.modalService.open(ApplicationAddComponent, {
    animation: true,
    keyboard: true,
    backdrop: true,
    modalDialogClass: 'modal-md',
  });
   addFeedBrandModal.componentInstance.existingApplication = application;
   addFeedBrandModal.componentInstance.isEditMode = true;

   if (addFeedBrandModal.componentInstance.afterSave) {
    addFeedBrandModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res) {
         const index = this.applicationList.findIndex((up: any) => up._id === res._id);
        let applicationRefs = JSON.parse(JSON.stringify(this.applicationList));

        applicationRefs[index].applicationType = res.applicationType;
        applicationRefs[index].applicantName = res.applicantName;
        applicationRefs[index].unit = res.unit;
        applicationRefs[index].costPerUnit = res.costPerUnit;

        this.applicationList = [...applicationRefs];
        this.store.dispatch(updateApplication(this.applicationList[index]));
      }
    });
  }
 }

 deleteSelected = () => {
  this.blockUI.start('Deleting....');
  const appIds: string[] = (this.applicationList.filter(x => x.isChecked === true)).map(x => x._id);
  if (appIds && appIds.length > 0) {
    this.proceedDelete(appIds);
  } else {
    this.toastrService.error("Please select items to delete.", "Error");
    this.blockUI.stop();
  }
}

deleteRecord = (appId: any) => {
  this.blockUI.start('Deleting....');
  this.proceedDelete([].concat(appId));
}

proceedDelete = (appIds: string[]) => {
  let form = new FormData();
  form.append("applicationIds", JSON.stringify(appIds));

  this.appListSubscriptions.push(this.applicationService.deleteApplication(form).subscribe((deletedResult: any) => {
    if (deletedResult) {
      this.isAllChecked = false;
      appIds.forEach(e => { const index: number = this.applicationList.findIndex((up: any) => up._id === e); this.applicationList.splice(index, 1); });
      this.store.dispatch(removeApplication(appIds));
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
    this.applicationList = this.applicationList.map(p => { return { ...p, isChecked: true }; });
  } else {
    this.applicationList = this.applicationList.map(up => { return { ...up, isChecked: false }; });
  }
}

singleSelectionChange = (index: number) => {
  this.isAllChecked = false;
  this.applicationList[index]['isChecked'] = !this.applicationList[index]['isChecked'];
}

 exportApplicationList = (type: any) => {
  this.blockUI.start('Exporting Excel...');
  if(type === ExportTypes.CSV){
    const csvData: any[] = this.applicationList.map(x => {
      return {
        'Applicant Name': x.applicantName,
        'Application Type': x.applicationType,
        'Unit': x.unit,
        'Cost Per Unit': x.costPerUnit,
        'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    this.fileService.exportAsExcelFile(csvData, "Applications-file");
    this.blockUI.stop();
  }
  else {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.applicationList.map(x => {
      return {
        'Applicant Name': x.applicantName,
        'Application Type': x.applicationType,
        'Unit': x.unit,
        'Cost Per Unit': x.costPerUnit,
        'Created On':  moment(x.createdOn).format('YYYY-MM-DD')
      }
    });
    const headers: any[] = ['Application Type', 'Unit', 'Cost Per Unit', 'Created On'];
    this.fileService.exportToPDF("Applications", headers, pdfData, 'Applications');
    this.blockUI.stop();
 }
}

 importApplications = () => {
   
 }

 ngOnDestroy() {
  if (this.appListSubscriptions && this.appListSubscriptions.length > 0) {
    this.appListSubscriptions.forEach(res => {
      res.unsubscribe();
    });
  }
}
}
