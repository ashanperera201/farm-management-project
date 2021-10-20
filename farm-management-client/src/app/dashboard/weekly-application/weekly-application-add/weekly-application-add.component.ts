import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppState } from 'src/app/redux';
import { addWeeklyApplication, updateWeeklyApplication } from 'src/app/redux/actions/weekly-applications.actions';
import { WeeklyApplicationModel } from 'src/app/shared/models/weekly-application';
import { ApplicationsService } from 'src/app/shared/services/applications.service';
import { ClubMemberService } from 'src/app/shared/services/club-member.service';
import { FarmService } from 'src/app/shared/services/farm.service';
import { PondService } from 'src/app/shared/services/pond.service';
import { WeeklyApplicationsService } from 'src/app/shared/services/weekly-applications.service';
import { keyPressDecimals, keyPressNumbers } from 'src/app/shared/utils';

@Component({
  selector: 'app-weekly-application-add',
  templateUrl: './weekly-application-add.component.html',
  styleUrls: ['./weekly-application-add.component.scss']
})
export class WeeklyApplicationAddComponent implements OnInit, OnDestroy {

  @Input() isEditMode: boolean = false;
  @Input() existingWeeklyApplication: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Weekly Application';
  feedBrandList: any[] = [];
  memberList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  applicationList: any[] = [];
  existingWeeklyApplications = new WeeklyApplicationModel();
  addWeeklyApplicationForm!: FormGroup;
  weeklyApplicationSubscriptions: Subscription[] = [];
  initialData: any = {
    farmList: [],
    memberList: [],
    pondList: [],
    applicationList: []
  }

  constructor(
    private weeklyApplicationsService: WeeklyApplicationsService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private pondService: PondService,
    private applicationsService: ApplicationsService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initWeeklyApplicationForm();
    this.fetchInitialData();
  }

  initWeeklyApplicationForm = () => {
    this.addWeeklyApplicationForm = new FormGroup({
      owner: new FormControl(null, Validators.compose([Validators.required])),
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      weekNumber: new FormControl(null, Validators.compose([Validators.required])),
      application: new FormControl(null, Validators.compose([Validators.required])),
      unit: new FormControl(null, Validators.required),
      numberOfUnit: new FormControl(null, Validators.compose([Validators.required]))
    });

    this.addWeeklyApplicationForm.controls['unit'].disable();
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.weeklyApplicationSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.memberList = ownerRes.result;
        this.initialData.memberList = this.memberList;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondList = resPonds.result;
        this.initialData.pondList = this.pondList;
      }
      return this.applicationsService.fetchApplications()
    })).pipe(switchMap((resApplication: any) => {
      if (resApplication && resApplication.result) {
        this.applicationList = resApplication.result;
        this.initialData.applicationList = this.applicationList;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.farmList = farmRes.result;
        this.initialData.farmList = this.farmList;
      }
      this.configValues();
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    }))
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Weekly Application";

      if (this.existingWeeklyApplication) {
        const form = this.existingWeeklyApplication;
        form.owner = this.existingWeeklyApplication.owner._id;
        form.farmer = this.existingWeeklyApplication.farmer._id;
        form.pond = this.existingWeeklyApplication.pond._id;
        form.application = this.existingWeeklyApplication.application._id;

        this.addWeeklyApplicationForm.patchValue(form);
        // this.ownerOnChange();
        // this.farmOnChange();

        this.addWeeklyApplicationForm.get("owner")?.patchValue(form.owner);
        this.addWeeklyApplicationForm.get("farmer")?.patchValue(form.farmer);
        this.addWeeklyApplicationForm.get("pond")?.patchValue(form.pond);
        this.addWeeklyApplicationForm.get("application")?.patchValue(form.application);
      }
    }
  }

  ownerOnChange = () => {
    const clubMember = this.addWeeklyApplicationForm.get("owner")?.value;
    if (clubMember) {
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === clubMember);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
  }

  farmOnChange = () => {
    const clubMember = this.addWeeklyApplicationForm.get("owner")?.value;
    const farm = this.addWeeklyApplicationForm.get("farmer")?.value;

    if (clubMember && farm) {
      // const stock = this.stockDetails.find(sd => sd.farmer._id === farmer);
      const pondList = this.initialData.pondList.filter((x: any) => (x.farmer && x.farmer._id === farm) && (x.owner && x.owner._id === clubMember));
      if (pondList && pondList.length > 0) {
        this.pondList = pondList;
      } else {
        this.pondList = [];
      }
    }
  }
  pondOnChange = () => {
    const owner = this.addWeeklyApplicationForm.get('owner')?.value;
    const farmer = this.addWeeklyApplicationForm.get('farmer')?.value;
    const pond = this.addWeeklyApplicationForm.get('pond')?.value;

    if (owner && farmer && pond) {
      // const stock = this.stockDetails.find(sd => sd.farmer._id === farmer);
      const applicationList = this.initialData.applicationList.filter((x: any) => (x.farmer && x.farmer._id === farmer) && (x.owner && x.owner._id === owner) && (x.pond && x.pond._id === pond));
      if (applicationList && applicationList.length > 0) {
        this.applicationList = applicationList;
      } else {
        this.applicationList = [];
      }
    }

  }

  applicationOnChange = () => {
    const applicationType = this.addWeeklyApplicationForm.get("application")?.value;
    if (applicationType) {
      const filteredApplication = this.initialData.applicationList.filter((x: any) => x._id === applicationType);
      if (filteredApplication && filteredApplication.length > 0) {
        this.addWeeklyApplicationForm.get("unit")?.patchValue(filteredApplication[0].unit);
      } else {
        this.addWeeklyApplicationForm.get("unit")?.patchValue('');
      }
    }
  }

  saveOrUpdateWeeklyApplication = () => {
    if (this.addWeeklyApplicationForm.valid) {
      const formRawValues: any = this.addWeeklyApplicationForm.getRawValue();

      const farmer = this.initialData.farmList.find((x: any) => x._id === formRawValues.farmer);
      const clubMember = this.initialData.memberList.find((x: any) => x._id === formRawValues.owner);
      const pond = this.initialData.pondList.find((x: any) => x._id === formRawValues.pond);
      const application = this.initialData.applicationList.find((x: any) => x._id === formRawValues.application);

      if (this.isEditMode) {

        const existsWeeklyApplication = this.existingWeeklyApplication;
        existsWeeklyApplication.farmer = formRawValues.farmer;
        existsWeeklyApplication.owner = formRawValues.owner;
        existsWeeklyApplication.pond = formRawValues.pond;
        existsWeeklyApplication.weekNumber = formRawValues.weekNumber;
        existsWeeklyApplication.application = formRawValues.application;
        existsWeeklyApplication.unit = formRawValues.unit;
        existsWeeklyApplication.numberOfUnit = formRawValues.numberOfUnit;

        this.weeklyApplicationSubscriptions.push(this.weeklyApplicationsService.updateWeeklyApplication(existsWeeklyApplication).subscribe(serviceRes => {
          if (serviceRes) {
            existsWeeklyApplication.farmer = farmer;
            existsWeeklyApplication.owner = clubMember;
            existsWeeklyApplication.pond = pond;
            existsWeeklyApplication.application = application;

            this.afterSave.emit(existsWeeklyApplication);
            this.store.dispatch(updateWeeklyApplication(existsWeeklyApplication));
            this.toastrService.success('Successfully updated.', 'Success');
            this.closeModal();
          }
        }, () => {
          this.toastrService.error('Failed to update.', 'Error');
        }))

      } else {
        this.blockUI.start('Saving in progress...');
        const formRawValues: any = this.addWeeklyApplicationForm.getRawValue();
        this.weeklyApplicationSubscriptions.push(this.weeklyApplicationsService.saveWeeklyApplication(formRawValues).subscribe((weeklyApplication: any) => {
          if (weeklyApplication && weeklyApplication.validity) {
            const savedResult = weeklyApplication.result;

            savedResult.farmer = farmer;
            savedResult.owner = clubMember;
            savedResult.pond = pond;
            savedResult.application = application;
            this.afterSave.emit(savedResult);
            this.store.dispatch(addWeeklyApplication(savedResult));
            this.toastrService.success("Successfully saved.", "Success");
            this.closeModal();
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Failed to save.", "Error");
          this.blockUI.stop();
        }));
      }
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  onKeyPressChangesDecimal = (event: any): boolean => {
    return keyPressDecimals(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    if (this.weeklyApplicationSubscriptions && this.weeklyApplicationSubscriptions.length > 0) {
      this.weeklyApplicationSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }


}
