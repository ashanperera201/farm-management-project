import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { farmModel } from '../../../shared/models/farm-model';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';
import { keyPressNumbers } from '../../../shared/utils';
import { Store } from '@ngrx/store';
import { addFarmManagement, AppState, updateFarmManagement } from '../../../redux';

@Component({
  selector: 'app-farm-add',
  templateUrl: './farm-add.component.html',
  styleUrls: ['./farm-add.component.scss']
})
export class FarmAddComponent implements OnInit, OnDestroy {

  @Input() isEditMode: boolean = false;
  @Input() existingFarm: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Farm';
  feedBrandList: any[] = [];
  farmList: any[] = [];
  ownerList: any[] = [];
  addFarmForm!: FormGroup;
  farmAddSubscription: Subscription[] = [];

  constructor(
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initAddFarmForm();
    this.setEditMode();
    this.patchForm();
    this.fetchClubMembers();
  }

  setEditMode = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Farm";
    }
  }

  patchForm = () => {
    if (this.isEditMode) {
      const form = this.existingFarm;
      form.owner = this.existingFarm.owner._id;
      this.addFarmForm.patchValue(form);
      this.blockUI.stop();
    }
  }

  initAddFarmForm = () => {
    this.addFarmForm = new FormGroup({
      owner: new FormControl(null, Validators.compose([Validators.required])),
      farmName: new FormControl(null, Validators.compose([Validators.required])),
      contactNo: new FormControl(null, Validators.compose([Validators.required])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      pondCount: new FormControl(null, Validators.compose([Validators.required, Validators.min(0)])),
    });
  }

  fetchClubMembers = () => {
    this.farmAddSubscription.push(this.clubMemberService.fetchClubMembers().subscribe(res => {
      if (res && res.result) {
        this.ownerList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load owners", "Error");
    }));
  }

  saveFarm = () => {
    this.blockUI.start('Processing......');
    if (this.isEditMode) {
      const farm = JSON.parse(JSON.stringify(this.existingFarm));
      farm.farmName = this.addFarmForm.value.farmName;
      farm.contactNo = this.addFarmForm.value.contactNo;
      farm.address = this.addFarmForm.value.address;
      farm.pondCount = this.addFarmForm.value.pondCount;
      farm.owner = this.addFarmForm.value.owner;
      this.farmService.updateFarm(farm).subscribe(res => {
        if (res) {
          const farmer = this.setOwner(farm);
          this.store.dispatch(updateFarmManagement(farm));
          this.toastrService.success("Farm updated successfully", "Success");
          this.afterSave.emit(farmer);
          this.closeModal();
        }
        this.blockUI.stop();
      }, () => {
        this.toastrService.error("Unable to update Farm", "Error");
        this.blockUI.stop();
      });
    }
    else {
      if (this.addFarmForm.valid) {
        const farm = new farmModel();
        farm.farmName = this.addFarmForm.value.farmName;
        farm.contactNo = this.addFarmForm.value.contactNo;
        farm.address = this.addFarmForm.value.address;
        farm.pondCount = this.addFarmForm.value.pondCount;
        farm.owner = this.addFarmForm.value.owner;
        this.farmService.saveFarm(farm).subscribe(res => {
          if (res && res.validity) {
            const farmer = this.setOwner(res.result.farmDetail);
            this.afterSave.emit(farmer);
            this.closeModal();
            this.store.dispatch(addFarmManagement(res.result));
            this.toastrService.success("Farm saved successfully", "Success");
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Unable to save Farm", "Error");
          this.blockUI.stop();
        });
      }
    }
  }

  setOwner = (result: any): any => {
    const owner: any = this.ownerList.find(x => x._id === result.owner);
    if (owner) {
      result.owner = owner;
      return result;
    }
  }

  clearAddFarmForm = () => {
    this.addFarmForm.reset();
  }

  closeModal = () => {
    this.activeModal.close();
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  ngOnDestroy() {
    if (this.farmAddSubscription && this.farmAddSubscription.length > 0) {
      this.farmAddSubscription.forEach(res => {
        res.unsubscribe();
      })
    }
  }
}
