import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { FarmService } from '../../../shared/services/farm.service';
import { pondModel } from './../../../shared/models/pond-model';
import { PondService } from '../../../shared/services/pond.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { keyPressDecimals } from '../../../shared/utils';
import { AppState } from '../../../redux';

@Component({
  selector: 'app-pond-add',
  templateUrl: './pond-add.component.html',
  styleUrls: ['./pond-add.component.scss']
})
export class PondAddComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() existingPond: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Pond';
  feedBrandList: any[] = [];
  addPondForm!: FormGroup;
  farmList: any[] = [];
  ownerList: any[] = [];
  pondSubscriptions: Subscription[] = [];
  initialData: any = {
    farmList: [],
    ownerList: [],
  }

  constructor(
    private pondService: PondService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initAddPondForm();
    this.fetchInitialDetails();
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Pond";
      if (this.existingPond) {
        const form = this.existingPond;
        form.owner = this.existingPond.owner._id;
        form.farmer = this.existingPond.farmer._id;
        this.addPondForm.patchValue(form);
        this.ownerOnChange();
        this.addPondForm.get("farmer")?.patchValue(form.farmer);
    }
  }
  this.blockUI.stop();
}

  patchExistsRecord = () => {
    const pond = Object.assign({}, this.existingPond);
    pond.owner = this.existingPond.owner._id;
    pond.farmer = this.existingPond.farmer._id;
    this.addPondForm.patchValue(pond);
    this.blockUI.stop();
  }

  initAddPondForm = () => {
    this.addPondForm = new FormGroup({
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      owner: new FormControl(null, Validators.compose([Validators.required])),
      pondNo: new FormControl(null, Validators.compose([Validators.required])),
      areaOfPond: new FormControl(null, Validators.compose([Validators.required])),
      gradeOfPond: new FormControl(null, Validators.compose([Validators.required])),
      fixedCost: new FormControl(null, Validators.compose([Validators.required, Validators.min(0)])),
    });
  }

  clearAddPondFormForm = () => {
    this.addPondForm.reset();
  }

  fetchInitialDetails = () => {
    this.blockUI.start('Fetching...');
    this.pondSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap(ownerRes => {
      if (ownerRes && ownerRes.result) {
        this.initialData.ownerList = ownerRes.result;
      }
      return this.farmService.fetchFarms()
    })).subscribe(farmServiceRes => {
      if (farmServiceRes && farmServiceRes.validity) {
        this.initialData.farmList = farmServiceRes.result;
      }
      this.configValues();
      this.blockUI.stop();
    })), () => {
      this.blockUI.stop();
    };
  }

  ownerOnChange = () => {
    const owner = this.addPondForm.get("owner")?.value;
    if (owner) {
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
  }

  savePond = () => {
    this.blockUI.start('Processing.....');
    if (this.addPondForm.valid) {
      if (this.isEditMode) {
        const pond = this.existingPond;
        pond.owner = this.addPondForm.value.owner;
        pond.farmer = this.addPondForm.value.farmer;
        pond.pondNo = this.addPondForm.value.pondNo;
        pond.areaOfPond = this.addPondForm.value.areaOfPond;
        pond.gradeOfPond = this.addPondForm.value.gradeOfPond;
        pond.fixedCost = this.addPondForm.value.fixedCost;

        this.pondService.updatePond(pond).subscribe(res => {
          if (res && res.result) {
            const pondData = this.setOwnerAndFarm(pond);
            this.closeModal();
            this.afterSave.emit(pondData);
            this.toastrService.success("Pond data updated successfully.", "Successfully Saved");
          }
          this.blockUI.stop();
        }, () => {
          this.blockUI.stop();
          this.toastrService.error("Unable to update pond data", "Error");
        });
    }
    else {
        const pond = new pondModel();
        pond.owner = this.addPondForm.value.owner;
        pond.farmer = this.addPondForm.value.farmer;
        pond.pondNo = this.addPondForm.value.pondNo;
        pond.areaOfPond = this.addPondForm.value.areaOfPond;
        pond.gradeOfPond = this.addPondForm.value.gradeOfPond;
        pond.fixedCost = this.addPondForm.value.fixedCost;

        this.pondService.savePond(pond).subscribe(res => {
          if (res && res.result) {
            const pondData = this.setOwnerAndFarm(res.result.pondDetail);
            this.afterSave.emit(pondData);
            this.closeModal();
            this.toastrService.success("Pond data saved successfully.", "Successfully Saved");
          }
          this.blockUI.stop();
        }, () => {
          this.blockUI.stop();
          this.toastrService.error("Unable to save pond data", "Error");
        });
    }
    }
  }

  setOwnerAndFarm = (result: any): any => {
    const owner: any = this.initialData.ownerList.find((x:any) => x._id === result.owner);
    const farm: any = this.farmList.find(x => x._id === result.farmer);
    if (owner || farm) {
      result.owner = owner;
      result.farmer = farm;
      return result;
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }

  onKeyPressChangesDecimal = (event: any): boolean => {
    return keyPressDecimals(event);
  }

  ngOnDestroy() {
    if (this.pondSubscriptions && this.pondSubscriptions.length > 0) {
      this.pondSubscriptions.forEach(res => {
        res.unsubscribe();
      });
    }
  }

}
