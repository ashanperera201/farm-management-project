import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { StockModel } from '../../../shared/models/stock-model';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';
import { PondService } from '../../../shared/services/pond.service';
import { StockService } from '../../../shared/services/stock.service';
import { keyPressDecimals } from '../../../shared/utils';
import { Store } from '@ngrx/store';
import { AppState, updateCycleValue } from '../../../redux';

@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.component.html',
  styleUrls: ['./stock-add.component.scss']
})
export class StockAddComponent implements OnInit, DoCheck {

  @Input() isEditMode: boolean = false;
  @Input() existingStock: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Stocking';
  addStockForm!: FormGroup;
  model: NgbDateStruct;
  stockSubscriptions: Subscription[] = [];

  pondList: any[] = [];
  farmList: any[] = [];
  ownerList: any[] = [];

  initialDataSet: any = {
    pondList: [],
    farmList: [],
    ownerList: []
  }

  cycleValue = 1;

  constructor(
    private pondService: PondService,
    private stockService: StockService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
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
    this.initAddStockForm();
    this.fetchInitialData();
  }

  ngDoCheck() {
    this.addStockForm.get('actualPlRemains')?.patchValue(this.addStockForm.value.plCount);
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Stock";
      this.patchExistsForm();
    } else {
      const current = new Date();
      this.model = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.addStockForm.get('dateOfStocking')?.patchValue(this.model);

      // this.store.select(selectCycleCount).subscribe(res => {
      //   if (res) {
      //     let count = +res + 1;
      //     this.addStockForm.get("cycle")?.patchValue('cycle' + count);
      //   } else {
      //     this.cycleValue = this.cycleValue++
      //     this.addStockForm.get("cycle")?.patchValue('cycle' + this.cycleValue);
      //   }
      // });

      let cycleVal = localStorage.getItem('cycle-count');

      if (cycleVal) {
        this.cycleValue = +cycleVal;
      } else {
        localStorage.setItem('cycle-count', this.cycleValue + '');
      }

      this.addStockForm.get("cycle")?.patchValue('cycle' + this.cycleValue);

    }
  }

  patchExistsForm = () => {
    let dateFormat = moment(this.existingStock.dateOfStocking).format('YYYY-MM-DD').split('-')
    this.model.year = +dateFormat[0];
    this.model.month = +dateFormat[1];
    this.model.day = +dateFormat[2];

    const stockForm = this.existingStock;

    stockForm.owner = stockForm.owner._id;
    stockForm.pond = stockForm.pond._id;
    stockForm.farmer = stockForm.farmer._id;
    stockForm.dateOfStocking = this.model;

    // TODO : CALCULATE ACTUAL PL'S REMAIINGS.
    // DO THIS IN BACK END.
    // TAKE DATE DATE
    // TAKE CURRENT DATE
    // MAKE DIFFERENCE BETWEEN CURRENT DATE AND TEH CREATED DATE
    // CHECK 28 DAYS = 4 weeks
    // IF YES ? 
    // * TAKE EXPECTED SURVIVAL PERCENTAGE FROM WEEKLY SAMPLING FORM
    // * TAKE NO OF PL'S HARVEST FROM HARVEST MANAGEMENT FORM.
    // AND FORMULATE : ( EXPECTED SURVIVAL PERCENTAGE * NO PL'S ) - NO OF PL'S HARVEST

    this.addStockForm.patchValue(stockForm);
    this.ownerOnChange();
    this.farmOnChange();
    this.addStockForm.get("farmer")?.patchValue(stockForm.farmer);
    this.addStockForm.get("pond")?.patchValue(stockForm.pond);
  }

  initAddStockForm = () => {
    this.addStockForm = new FormGroup({
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      owner: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      plCount: new FormControl(null, Validators.compose([Validators.required])),
      plAge: new FormControl(null, Validators.compose([Validators.required])),
      dateOfStocking: new FormControl(null, Validators.compose([Validators.required])),
      fullStocked: new FormControl(null, Validators.compose([Validators.required])),
      plPrice: new FormControl(null, Validators.compose([Validators.required])),
      actualPlRemains: new FormControl(null, Validators.compose([Validators.required])),
      cycle: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.addStockForm.controls['actualPlRemains'].disable();
    this.addStockForm.controls['cycle'].disable();
  }

  clearAddStockForm = () => {
    this.addStockForm.reset();
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching........');
    this.stockSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((clubMemberResults: any) => {
      if (clubMemberResults && clubMemberResults.result) {
        this.ownerList = clubMemberResults.result;
      }
      return this.farmService.fetchFarms();
    })).pipe(switchMap((farmResult: any) => {
      if (farmResult && farmResult.result) {
        this.initialDataSet.farmList = farmResult.result;
      }
      return this.pondService.fetchPonds();
    })).subscribe((pondResult: any) => {
      if (pondResult && pondResult.result) {
        this.initialDataSet.pondList = pondResult.result;
      }
      this.configValues();
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    }))
  }

  ownerOnChange = () => {
    const owner = this.addStockForm.get("owner")?.value;
    if (owner) {
      const filteredFarmList = this.initialDataSet.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
  }

  farmOnChange = () => {
    const farmer = this.addStockForm.get("farmer")?.value;
    const owner = this.addStockForm.get("owner")?.value;

    if (farmer && owner) {
      const pondList = this.initialDataSet.pondList.filter((x: any) => (x.farmer && x.farmer._id === farmer) && (x.owner && x.owner._id === owner));
      if (pondList && pondList.length > 0) {
        this.pondList = pondList;
      } else {
        this.pondList = [];
      }
    }
  }


  fetchFarmsOwnerWise = (owner: number) => {
    this.farmService.fetchFarmByowner(owner).subscribe(res => {
      if (res && res.result) {
        this.farmList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load Farms", "Error");
    });
  }

  saveStock = () => {

    if (this.addStockForm.valid) {
      const stockForm = this.addStockForm.getRawValue();

      const owner: any = this.ownerList.find((x: any) => x._id === stockForm.owner);
      const farmer: any = this.initialDataSet.farmList.find((x: any) => x._id === stockForm.farmer);
      const pond: any = this.initialDataSet.pondList.find((x: any) => x._id === stockForm.pond);

      if (this.isEditMode) {

        const stock = this.existingStock;

        stock.owner = stockForm.owner;
        stock.farmer = stockForm.farmer;
        stock.pond = stockForm.pond;
        stock.plCount = stockForm.plCount;
        stock.plAge = stockForm.plAge;
        stock.dateOfStocking = this.parserFormatter.format(stockForm.dateOfStocking);
        stock.fullStocked = stockForm.fullStocked;
        stock.plPrice = stockForm.plPrice;
        stock.actualPlRemains = stockForm.actualPlRemains;
        stock.cycle = stockForm.cycle;

        this.stockService.updateStock(stock).subscribe(res => {
          if (res) {
            stock.owner = owner;
            stock.farmer = farmer;
            stock.pond = pond;
            this.afterSave.emit(stock);
            this.toastrService.success("Stock data updated successfully.", "Successfully Saved");
            this.closeModal();
          }
        }, () => {
          this.toastrService.error("Unable to update stock data", "Error");
        });
      } else {
        const stock = new StockModel();
        stock.owner = stockForm.owner;
        stock.farmer = stockForm.farmer;
        stock.pond = stockForm.pond;
        stock.plCount = stockForm.plCount;
        stock.plAge = stockForm.plAge;
        stock.dateOfStocking = this.parserFormatter.format(stockForm.dateOfStocking);
        stock.fullStocked = stockForm.fullStocked;
        stock.plPrice = stockForm.plPrice;
        stock.actualPlRemains = stockForm.actualPlRemains;
        stock.cycle = stockForm.cycle;

        this.stockService.saveStock(stock).subscribe(res => {
          if (res && res.result) {
            this.afterSave.emit(res.result);
            this.closeModal();
            this.store.dispatch(updateCycleValue(this.cycleValue));
            let cycleVal = localStorage.getItem('cycle-count');
            if (cycleVal) {
              this.cycleValue = +cycleVal + 1;
              localStorage.setItem('cycle-count', this.cycleValue + '');
              this.addStockForm.get("cycle")?.patchValue('cycle' + this.cycleValue);
            }
            this.toastrService.success("Stock data saved successfully.", "Successfully Saved");
          }
        }, () => {
          this.toastrService.error("Unable to save stock data", "Error");
        });
      }
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressDecimals(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }
}
