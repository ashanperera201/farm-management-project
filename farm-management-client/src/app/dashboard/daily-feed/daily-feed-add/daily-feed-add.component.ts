import { FarmDetailReportComponent } from './../../reporting/farm-detail-report/farm-detail-report.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DailyFeedModel } from '../../../shared/models/daily-feed-model';
import { keyPressDecimals, keyPressNumbers } from '../../../shared/utils';
import { PondService } from './../../../shared/services/pond.service';
import { FarmService } from './../../../shared/services/farm.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { DailyFeedService } from './../../../shared/services/daily-feed.service';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { addDailyFeed, AppState, updateDailyFeed } from '../../../redux';

@Component({
  selector: 'app-daily-feed-add',
  templateUrl: './daily-feed-add.component.html',
  styleUrls: ['./daily-feed-add.component.scss']
})
export class DailyFeedAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingDailyFeed: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Daily Feed';
  feedBrandList: any[] = [];
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  existingData = new DailyFeedModel();
  addDailyFeedForm!: FormGroup;
  dailyFeedSubscriptions: Subscription[] = [];
  model: NgbDateStruct;
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }
  //TODO
  calculatedDailyFeed = 25;

  constructor(
    private dailyFeedService : DailyFeedService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private parserFormatter: NgbDateParserFormatter,
    private store: Store<AppState>) {
      this.model = {
        year: 0,
        month: 0,
        day: 0
      }
    }

  ngOnInit(): void {
    this.initAddDailyFeedForm();
    this.fetchInitialData();
  }

  initAddDailyFeedForm = () => {
    this.addDailyFeedForm = new FormGroup({
      owner: new FormControl(null, Validators.compose([Validators.required])),
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      dailyFeedDate: new FormControl(null, Validators.compose([Validators.required])),
      calculatedDailyFeed: new FormControl(this.calculatedDailyFeed),
      actualNumberOfKilos: new FormControl(null, Validators.compose([Validators.required])),
      remark: new FormControl(null)
    });
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.dailyFeedSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
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
      this.configValues();
    }, () => {
      this.blockUI.stop();
    }))
    this.blockUI.stop();
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Daily Feed";
      this.patchForm();
    }
    else{
      const current = new Date();
      this.model = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.addDailyFeedForm.get('dailyFeedDate')?.patchValue(this.model);
    }
    this.blockUI.stop();
  }

  patchForm = () => {
    let dateFormat = moment(this.existingDailyFeed.dailyFeedDate).format('YYYY-MM-DD').split('-')
    this.model.year = +dateFormat[0];
    this.model.month = +dateFormat[1];
    this.model.day = +dateFormat[2];
    
    if (this.existingDailyFeed) {
      const feed = JSON.parse(JSON.stringify(this.existingDailyFeed));
      feed.owner = this.existingDailyFeed.owner._id;
      feed.farmer = this.existingDailyFeed.farmer._id;
      feed.pond = this.existingDailyFeed.pond._id;
      feed.dailyFeedDate =  this.model;
      feed.calculatedDailyFeed = this.existingDailyFeed.calculatedDailyFeed;
      feed.actualNumberOfKilos = this.existingDailyFeed.actualNumberOfKilos;
      feed.remark = this.existingDailyFeed.remark;
      this.addDailyFeedForm.patchValue(feed);
      this.ownerOnChange();
      this.farmOnChange();
      this.addDailyFeedForm.get("farmer")?.patchValue(feed.farmer);
      this.addDailyFeedForm.get("pond")?.patchValue(feed.pond);
    }
    this.blockUI.stop();
  }

  saveDailyFeed = () => {
    if (this.addDailyFeedForm.valid) {
      if (this.isEditMode) {
        const dailyFeed = this.existingData;
        dailyFeed.owner = this.addDailyFeedForm.value.owner;
        dailyFeed.farmer = this.addDailyFeedForm.value.farmer;
        dailyFeed.pond = this.addDailyFeedForm.value.pond;
        dailyFeed.dailyFeedDate = this.parserFormatter.format(this.addDailyFeedForm.value.dailyFeedDate);
        dailyFeed.calculatedDailyFeed = this.addDailyFeedForm.value.calculatedDailyFeed;
        dailyFeed.actualNumberOfKilos = this.addDailyFeedForm.value.actualNumberOfKilos;
        dailyFeed.remark = this.addDailyFeedForm.value.remark;

        this.dailyFeedService.updateDailyFeed(dailyFeed).subscribe(res => {
          if (res) {
            const dailyFeedData = this.setOtherData(dailyFeed);
            this.afterSave.emit(dailyFeedData);
            this.closeModal();
            this.store.dispatch(updateDailyFeed(dailyFeed));
            this.toastrService.success("Daily Feed data updated successfully", "Success");
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Unable to update data", "Error");
          this.blockUI.stop();
        });
      }
      else {
        const dailyFeed = new DailyFeedModel();
        dailyFeed.owner = this.addDailyFeedForm.value.owner;
        dailyFeed.farmer = this.addDailyFeedForm.value.farmer;
        dailyFeed.pond = this.addDailyFeedForm.value.pond;
        dailyFeed.dailyFeedDate = this.parserFormatter.format(this.addDailyFeedForm.value.dailyFeedDate);
        dailyFeed.calculatedDailyFeed = this.addDailyFeedForm.value.calculatedDailyFeed;
        dailyFeed.actualNumberOfKilos = this.addDailyFeedForm.value.actualNumberOfKilos;
        dailyFeed.remark = this.addDailyFeedForm.value.remark;

        this.dailyFeedService.saveDailyFeed(dailyFeed).subscribe(res => {
          if (res && res.result) {
            const dailyFeedData = this.setOtherData(res.result);
            this.afterSave.emit(dailyFeedData);
            this.closeModal();
            this.store.dispatch(addDailyFeed(res.result));
            this.toastrService.success("Data saved successfully", "Success");
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Unable to save data", "Error");
          this.blockUI.stop();
        });
      }
    }
  }

  setOtherData = (result: any): any => {
    const owner: any = this.ownerList.find(x => x._id === result.owner);
    const farm: any = this.farmList.find(x => x._id === result.farmer);
    const pond: any = this.pondList.find(x => x._id === result.pond);
    if (owner || farm) {
      result.owner = owner;
      result.farmer = farm;
      result.pond = pond;
      return result;
    }
  }

  ownerOnChange = () => {
    const owner = this.addDailyFeedForm.get("owner")?.value;
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
    const farmer = this.addDailyFeedForm.get("farmer")?.value;
    if (farmer) {
      const filteredPondList = this.initialData.pondList.filter((x: any) => x.farmer && x.farmer._id === farmer);
      if (filteredPondList && filteredPondList.length > 0) {
        this.pondList = filteredPondList;
      } else {
        this.pondList = [];
      }
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

  onKeyPressChangesDecimal = (event: any): boolean => {
    return keyPressDecimals(event);
  }

}
