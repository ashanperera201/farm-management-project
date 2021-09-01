import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApplicationsService } from '../../../shared/services/applications.service';
import { ApplicationModel } from './../../../shared/models/application-model';
import { keyPressDecimals } from '../../../shared/utils';
import { Store } from '@ngrx/store';
import { addApplication, AppState, updateApplication } from '../../../redux';

@Component({
  selector: 'app-application-add',
  templateUrl: './application-add.component.html',
  styleUrls: ['./application-add.component.scss']
})
export class ApplicationAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingApplication: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  addApplicationForm!: FormGroup;
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Application';
  feedBrandList: any[] = [];
  existingData = new ApplicationModel();
  
  constructor(
    private applicationService : ApplicationsService,
    private toastrService:ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initAddApplicationForm();
    this.setEditMode();
  }
  
  setEditMode = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Application";
      this.patchForm();
    }
  }

  patchForm = () => {
    if(this.existingApplication){
      this.addApplicationForm.patchValue(this.existingApplication);
    }
  }

  initAddApplicationForm = () => {
    this.addApplicationForm = new FormGroup({
      applicationType : new FormControl(null,Validators.compose([Validators.required])),
      applicantName : new FormControl(null,Validators.compose([Validators.required])),
      unit : new FormControl(null),
      costPerUnit : new FormControl(null,Validators.compose([Validators.min(0)]))
    });
  }

  clearAddApplicationForm = () => {
    this.addApplicationForm.reset();
  }

  saveApplication = () => {
    this.blockUI.start('Processing.....');
    if(this.isEditMode){
      if(this.addApplicationForm.valid){
        const application = JSON.parse(JSON.stringify(this.existingApplication));
        application.applicationType = this.addApplicationForm.value.applicationType;
        application.applicantName = this.addApplicationForm.value.applicantName;
        application.unit = this.addApplicationForm.value.unit;
        application.costPerUnit = this.addApplicationForm.value.costPerUnit;
        this.applicationService.updateApplication(application).subscribe(res => {
          if(res){
            this.closeModal();
            this.afterSave.emit(application);
            this.store.dispatch(updateApplication(application));
            this.toastrService.success("Application data updated successfully","Success");
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Unable to update Application","Error");
          this.blockUI.stop();
        });
      }
    }
    else{
      if(this.addApplicationForm.valid){
        const application = new ApplicationModel();
        application.applicationType = this.addApplicationForm.value.applicationType;
        application.applicantName = this.addApplicationForm.value.applicantName;
        application.unit = this.addApplicationForm.value.unit;
        application.costPerUnit = this.addApplicationForm.value.costPerUnit;
        this.applicationService.saveApplication(application).subscribe(res => {
          if(res && res.result){
            this.closeModal();
            this.store.dispatch(addApplication(res.result));
            this.toastrService.success("Application saved successfully","Success");
            this.afterSave.emit(res.result);
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Unable to save Application","Error");
          this.blockUI.stop();
        });
      }
    }
  }

  onKeyPressChangesDecimal = (event: any): boolean => {
    return keyPressDecimals(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
