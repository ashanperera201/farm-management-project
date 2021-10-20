import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';
import { keyPressNumbers } from '../../../shared/utils';
import { DailyFeedModel } from '../../../shared/models/daily-feed-model';
import { PondService } from '../../../shared/services/pond.service';
import { HarvestService } from '../../../shared/services/harvest.service';
import { Store } from '@ngrx/store';
import { addHarvest, AppState, updateHarvest } from '../../../redux';

@Component({
  selector: 'app-harvest-add',
  templateUrl: './harvest-add.component.html',
  styleUrls: ['./harvest-add.component.scss']
})
export class HarvestAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingHarvest: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Harvest';
  feedBrandList: any[] = [];
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  existingData = new DailyFeedModel();
  harvestForm!: FormGroup;
  harvestSubscription: Subscription[] = [];
  harvestTypes = [
    {
      code: 'PARTIAL',
      value: 'Partial'
    },
    {
      code: 'FULL',
      value: 'Full'
    }
  ];
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }

  constructor(
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private pondService: PondService,
    private harvestService: HarvestService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initAddDailyFeedForm();
    this.fetchInitialData();
  }

  initAddDailyFeedForm = () => {
    this.harvestForm = new FormGroup({
      owner: new FormControl(null, Validators.compose([Validators.required])),
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      harvestDate: new FormControl(moment(new Date).format('YYYY-MM-DD'), Validators.compose([Validators.required])),
      harvestType: new FormControl(null, Validators.compose([Validators.required])),
      harvestQuantity: new FormControl(null, Validators.compose([Validators.required])),
      harvestAWB: new FormControl(null, Validators.compose([Validators.required])),
      harvestSalePrice: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.harvestSubscription.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.ownerList = ownerRes.result;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.initialData.pondList = resPonds.result;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.initialData.farmList = farmRes.result;
      }
      this.setEditModeValues();
    }));
    this.blockUI.stop();
  }

  setEditModeValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Harvest";
      this.patchForm();
    }
  }

  patchForm = () => {
    if (this.existingHarvest) {
      const harvest = Object.assign({}, this.existingHarvest);
      harvest.owner = this.existingHarvest.owner._id;
      harvest.farmer = this.existingHarvest.farmer._id;
      harvest.pond = this.existingHarvest.pond._id;
      this.harvestForm.patchValue(harvest);
      this.ownerOnChange();
      this.farmOnChange();
      this.harvestForm.get("farmer")?.patchValue(harvest.farmer);
      this.harvestForm.get("pond")?.patchValue(harvest.pond);
    }
    this.blockUI.stop();
  }

  saveHarvest = () => {
    this.blockUI.start('Start processing');
    const request = this.harvestForm.getRawValue();

    if (this.isEditMode) {
      request._id = this.existingHarvest._id;
      let harvestManagement = JSON.parse(JSON.stringify(this.existingHarvest));

      harvestManagement.owner = this.harvestForm.value.owner;
      harvestManagement.farmer = this.harvestForm.value.farmer;
      harvestManagement.pond = this.harvestForm.value.pond;
      harvestManagement.harvestDate = this.harvestForm.value.harvestDate;
      harvestManagement.harvestType = this.harvestForm.value.harvestType;
      harvestManagement.harvestQuantity = this.harvestForm.value.harvestQuantity;
      harvestManagement.harvestAWB = this.harvestForm.value.harvestAWB;
      harvestManagement.harvestSalePrice = this.harvestForm.value.harvestSalePrice;

      this.harvestService.updateHarvest(harvestManagement).subscribe(res => {
        if (res && res.validity) {
          this.closeModal();
          this.store.dispatch(updateHarvest(harvestManagement));
          this.toastrService.success("Harvest updated successfully", "Success");
          
          const emittingRes = this.setOtherData({ ...harvestManagement });
          this.afterSave.emit({ ...emittingRes });
        }
        this.blockUI.stop();
      }, error => {
        this.toastrService.error("Error occured", "Error");
        this.blockUI.stop();
      });
    } else {
      this.harvestService.saveHarvest(request).subscribe(res => {
        if (res && res.result.harvestManagement) {
          const percentageFeedingData = this.setOtherData(res.result.harvestManagement);
          this.afterSave.emit(percentageFeedingData);
          this.closeModal();
          this.store.dispatch(addHarvest(res.result.harvestManagement));
          this.toastrService.success("Harvest save successfully", "Success");
        }
        this.blockUI.stop();
      }, error => {
        this.toastrService.error("Error occured", "Error");
        this.blockUI.stop();
      });
    }
  }

  ownerOnChange = () => {
    const owner = this.harvestForm.get("owner")?.value;
    if (owner) {
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
  }

  farmOnChange = () => {
    const farmer = this.harvestForm.get("farmer")?.value;
    if (farmer) {
      const filteredPondList = this.initialData.pondList.filter((x: any) => x.farmer && x.farmer._id === farmer);
      if (filteredPondList && filteredPondList.length > 0) {
        this.pondList = filteredPondList;
      } else {
        this.pondList = [];
      }
    }
  }

  setOtherData = (result: any): any => {
    const owner: any = this.ownerList.find(x => x._id === result.owner);
    const farm: any = this.farmList.find(x => x._id === result.farmer);
    const pond: any = this.pondList.find(x => x._id === result.pond);
    if (owner || farm || pond) {
      result.owner = owner;
      result.farmer = farm;
      result.pond = pond;
      return result;
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

  get numberOfPLs() {
    if (this.harvestForm.get('harvestType')?.value === 'FULL') {
      return 0;
    }
    if (this.harvestForm && this.harvestForm.get('harvestQuantity')?.value != null && this.harvestForm.get('harvestAWB')?.value != null) {
      return ((this.harvestForm.get('harvestQuantity')?.value) * 1000 / this.harvestForm.get('harvestAWB')?.value).toFixed(2);
    }
    return '';
  }
}
