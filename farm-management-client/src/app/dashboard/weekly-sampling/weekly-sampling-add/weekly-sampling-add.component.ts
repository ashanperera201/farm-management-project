import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs'
import { switchMap } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppState, selectStockDetails, selectWeeklySamplings, addWeeklySamplings, updateWeeklySamplings } from '../../../redux';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { WeeklySamplingService } from '../../../shared/services/weekly-sampling.service';
import { FarmService } from '../../../shared/services/farm.service';
import { PondService } from '../../../shared/services/pond.service';
import { keyPressNumbers } from '../../../shared/utils';


@Component({
  selector: 'app-weekly-sampling-add',
  templateUrl: './weekly-sampling-add.component.html',
  styleUrls: ['./weekly-sampling-add.component.scss']
})
export class WeeklySamplingAddComponent implements OnInit, OnDestroy {

  @Input() isEditMode: boolean = false;
  @Input() existingWeeklySampling: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Weekly Sampling';
  pondList: any[] = [];
  addWeeklySamplingForm!: FormGroup;
  farmList: any[] = [];
  ownerList: any[] = [];
  modelSampling: NgbDateStruct;
  stockDetails: any[] = [];
  weeklySamplingSubscription: Subscription[] = [];

  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }

  constructor(
    private pondService: PondService,
    private clubMemberService: ClubMemberService,
    private weeklySamplingService: WeeklySamplingService,
    private farmService: FarmService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private parserFormatter: NgbDateParserFormatter,
    private store: Store<AppState>
  ) {
    this.modelSampling = {
      year: 0,
      month: 0,
      day: 0
    }
  }

  ngOnInit(): void {
    this.initAddWeeklySamplingForm();
    this.fetchInitialDetails();
  }

  // TODO : REST OF SERVICE CALLS WILL BE REMOVED.
  fetchInitialDetails = () => {
    this.blockUI.start('Fetching...');
    this.weeklySamplingSubscription.push(this.store.select(selectStockDetails).pipe(switchMap(stockDetails => {
      if (stockDetails) {
        this.stockDetails = stockDetails;
      }
      return this.store.select(selectWeeklySamplings)
    })).pipe(switchMap(weeklySamplings => {
      if (weeklySamplings) {
        const pAvgBodyWeight = weeklySamplings[weeklySamplings.length - 1].averageBodyWeight;
        this.addWeeklySamplingForm.get("previousAwb")?.setValue(pAvgBodyWeight);
      }
      return this.clubMemberService.fetchClubMembers();
    })).pipe(switchMap(clubMemberRes => {
      if (clubMemberRes && clubMemberRes.validity) {
        this.initialData.ownerList = clubMemberRes.result;
      }
      return this.farmService.fetchFarms()
    })).pipe(switchMap(farmServiceRes => {
      if (farmServiceRes && farmServiceRes.validity) {
        this.initialData.farmList = farmServiceRes.result;
      }
      return this.pondService.fetchPonds();
    }))
      .subscribe(pondServiceRes => {
        if (pondServiceRes && pondServiceRes.validity) {
          this.initialData.pondList = pondServiceRes.result;
        }
        this.configValues();
        this.blockUI.stop();
      }, (e) => {
        this.blockUI.stop();
      }));
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Weekly Sampling";

      if (this.existingWeeklySampling) {
        let dateFormat = moment(this.existingWeeklySampling.samplingDate).format('YYYY-MM-DD').split('-')
        this.modelSampling.year = +dateFormat[0];
        this.modelSampling.month = +dateFormat[1];
        this.modelSampling.day = +dateFormat[2];

        const form = this.existingWeeklySampling;
        form.samplingDate = this.modelSampling;
        form.owner = this.existingWeeklySampling.owner._id;
        form.farmer = this.existingWeeklySampling.farmer._id;
        form.pond = this.existingWeeklySampling.pond._id;

        this.addWeeklySamplingForm.patchValue(form);
        this.ownerOnChange();
        this.farmOnChange();

        this.addWeeklySamplingForm.get("farmer")?.patchValue(form.farmer);
        this.addWeeklySamplingForm.get("pond")?.patchValue(form.pond);
      }
    } else {
      const current = new Date();
      this.modelSampling = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.addWeeklySamplingForm.get('samplingDate')?.patchValue(this.modelSampling);

    }
  }

  initAddWeeklySamplingForm = () => {
    this.addWeeklySamplingForm = new FormGroup({
      samplingDate: new FormControl(null, Validators.compose([Validators.required])),
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      owner: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      dateOfCulture: new FormControl(null, Validators.compose([Validators.required])),
      totalWeight: new FormControl(null, Validators.compose([Validators.required])),
      totalShrimp: new FormControl(null, Validators.compose([Validators.required])),
      averageBodyWeight: new FormControl(null, Validators.compose([Validators.required])),
      previousAwb: new FormControl(0, Validators.compose([Validators.required])),
      gainInWeight: new FormControl(null, Validators.compose([Validators.required])),
      expectedSurvivalPercentage: new FormControl(null, Validators.compose([Validators.required]))
    });

    this.addWeeklySamplingForm.controls['dateOfCulture'].disable();
    this.addWeeklySamplingForm.controls['averageBodyWeight'].disable();
    this.addWeeklySamplingForm.controls['previousAwb'].disable();
    this.addWeeklySamplingForm.controls['gainInWeight'].disable();
  }

  ownerOnChange = () => {
    const owner = this.addWeeklySamplingForm.get("owner")?.value;
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
    const farmer = this.addWeeklySamplingForm.get("farmer")?.value;
    const owner = this.addWeeklySamplingForm.get("owner")?.value;

    if (farmer && owner) {
      const stock = this.stockDetails.find(sd => sd.farmer._id === farmer);
      const pondList = this.initialData.pondList.filter((x: any) => (x.farmer && x.farmer._id === farmer) && (x.owner && x.owner._id === owner));
      if (pondList && pondList.length > 0) {
        this.pondList = pondList;
      } else {
        this.pondList = [];
      }
      this.calculateDateOfCulture(stock);
    }
  }

  calculateDateOfCulture = (stock: any) => {
    if (stock) {
      const currentDate = new Date();
      const stockDate = new Date(stock.dateOfStocking);
      const subtractedDate = currentDate.getDate() - stockDate.getDate();
      currentDate.setDate(subtractedDate);
      this.addWeeklySamplingForm.get("dateOfCulture")?.setValue(moment(currentDate).format('M/D/YYYY'));
    }
  }

  calculateGain = () => {
    const awb = +this.addWeeklySamplingForm.get("averageBodyWeight")?.value;
    const pAwb = +this.addWeeklySamplingForm.get("previousAwb")?.value;

    if (awb >= 0 && pAwb >= 0) {
      const gain = awb - pAwb;
      this.addWeeklySamplingForm.get("gainInWeight")?.setValue(gain);
    }
  }

  calculateAwb = () => {
    const totalWeight = this.addWeeklySamplingForm.get("totalWeight")?.value;
    const totalShrimp = this.addWeeklySamplingForm.get("totalShrimp")?.value;

    if (totalWeight && totalShrimp) {
      const awb = (totalWeight / totalShrimp).toFixed(2);
      this.addWeeklySamplingForm.get("averageBodyWeight")?.setValue(awb);
      this.calculateGain();
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

  saveOrUpdateWeeklySampling = () => {
    if (this.addWeeklySamplingForm.valid) {
      const formRawValues: any = this.addWeeklySamplingForm.getRawValue();

      const farmer = this.initialData.farmList.find((x: any) => x._id === formRawValues.farmer);
      const owner = this.initialData.ownerList.find((x: any) => x._id === formRawValues.owner);
      const pond = this.initialData.pondList.find((x: any) => x._id === formRawValues.pond);

      if (this.isEditMode) {

        const existsSample = this.existingWeeklySampling;

        existsSample.samplingDate = this.parserFormatter.format(formRawValues.samplingDate);
        existsSample.farmer = formRawValues.farmer;
        existsSample.owner = formRawValues.owner;
        existsSample.pond = formRawValues.pond;
        existsSample.dateOfCulture = formRawValues.dateOfCulture;
        existsSample.totalWeight = formRawValues.totalWeight;
        existsSample.totalShrimp = formRawValues.totalShrimp;
        existsSample.averageBodyWeight = formRawValues.averageBodyWeight;
        existsSample.previousAwb = formRawValues.previousAwb;
        existsSample.gainInWeight = formRawValues.gainInWeight;
        existsSample.expectedSurvivalPercentage = formRawValues.expectedSurvivalPercentage;

        this.weeklySamplingSubscription.push(this.weeklySamplingService.updateWeeklySampling(existsSample).subscribe(serviceRes => {
          if (serviceRes) {
            existsSample.farmer = farmer;
            existsSample.owner = owner;
            existsSample.pond = pond;

            this.afterSave.emit(existsSample);
            this.store.dispatch(updateWeeklySamplings(existsSample));
            this.toastrService.success('Successfully updated.', 'Success');
            this.closeModal();
          }
        }, () => {
          this.toastrService.error('Failed to update.', 'Error');
        }))

      } else {
        this.blockUI.start('Saving in progress...');
        const formRawValues: any = this.addWeeklySamplingForm.getRawValue();
        let payload = {
          ...formRawValues,
          samplingDate: this.parserFormatter.format(formRawValues.samplingDate)
        };
        this.weeklySamplingSubscription.push(this.weeklySamplingService.createWeeklySampling(payload).subscribe((weeklySampling: any) => {
          if (weeklySampling && weeklySampling.validity) {
            const savedResult = weeklySampling.result.weeklySampling;

            savedResult.farmer = farmer;
            savedResult.owner = owner;
            savedResult.pond = pond;

            this.afterSave.emit(savedResult);
            this.store.dispatch(addWeeklySamplings(savedResult));
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

  ngOnDestroy(): void {
    if (this.weeklySamplingSubscription && this.weeklySamplingSubscription.length > 0) {
      this.weeklySamplingSubscription.forEach(e => {
        e.unsubscribe();
      })
    }
  }

}
