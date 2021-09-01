import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { FarmService } from '../../../shared/services/farm.service';
import { PondService } from '../../../shared/services/pond.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { keyPressNumbers } from '../../../shared/utils/keyboard-event';
import { WeeklyPerformanceReportComponent } from '../weekly-performance-report/weekly-performance-report.component';
import { AppState, selectsalesPrice, selectStockDetails, selectWeeklySamplings } from '../../../redux';


@Component({
  selector: 'app-weekly-performance-show',
  templateUrl: './weekly-performance-show.component.html',
  styleUrls: ['./weekly-performance-show.component.scss']
})
export class WeeklyPerformanceShowComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  weeklyPerformanceForm!: FormGroup;
  farmList: any[] = [];
  ownerList: any[] = [];
  pondList: any[] = [];
  weeklyPerformanceSubscriptions: Subscription[] = [];
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }

  gainInWeight: any;
  totalBioMass: any;
  weeklySamplingFilterdata: any;
  stockFilterdata: any;
  salesPriceFilterdata: any;

  constructor(
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private modalService : NgbModal,
    private toastrService : ToastrService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.initAddPondForm();
    this.fetchInitialData();
  }

  initAddPondForm = () => {
    this.weeklyPerformanceForm = new FormGroup({
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      owner: new FormControl(null, Validators.compose([Validators.required])),
      pondNo: new FormControl(null, Validators.compose([Validators.required])),
      weekNumber: new FormControl(1, Validators.compose([Validators.required])),
    });
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.weeklyPerformanceSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
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
    }, () => {
      this.blockUI.stop();
    }))
    this.blockUI.stop();
  }

  ownerOnChange = () => {
    this.blockUI.start("Fetching Farms...");
    const owner = this.weeklyPerformanceForm.get("owner")?.value;
    if (owner) {
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
    this.blockUI.stop();
  }

  farmOnChange = () => {
    this.blockUI.start("Fetching Ponds...");
    const farmer = this.weeklyPerformanceForm.get("farmer")?.value;
    if (farmer) {
      const filteredPondList = this.initialData.pondList.filter((x: any) => x.farmer && x.farmer._id === farmer);
      if (filteredPondList && filteredPondList.length > 0) {
        this.pondList = filteredPondList;
      } else {
        this.pondList = [];
      }
    }
    this.blockUI.stop();
  }

  showWeeklyPerformance = () => {
    if(this.weeklyPerformanceForm.valid && this.weeklyPerformanceForm.value.weekNumber > 0){
      const performanceReportModal = this.modalService.open(WeeklyPerformanceReportComponent, {
        animation: true,
        keyboard: true,
        backdrop: true,
        modalDialogClass: 'modal-lg',
      });
      performanceReportModal.componentInstance.initialData = this.weeklyPerformanceForm.value;
    }
    else {
      this.toastrService.error("Please enter valid values","Error");
    }
    //TO DO
    this.store.select(selectWeeklySamplings).subscribe(res => {
      if (res) {
        this.weeklySamplingFilterdata = res.filter((x: any) => (x.owner && x.owner._id === this.weeklyPerformanceForm.get("owner")?.value) && (x.farmer && x.farmer._id === this.weeklyPerformanceForm.get("farmer")?.value) && (x.pond && x.pond._id === this.weeklyPerformanceForm.get("pondNo")?.value));
        if(this.weeklySamplingFilterdata && this.weeklySamplingFilterdata.legth > 0)
        {
          this.gainInWeight = this.weeklySamplingFilterdata[0].gainInWeight;
        }
      }
    });

    this.store.select(selectStockDetails).subscribe(res => {
      if (res) {
        this.stockFilterdata = res.filter((x: any) => (x.owner && x.owner._id === this.weeklyPerformanceForm.get("owner")?.value) && (x.farmer && x.farmer._id === this.weeklyPerformanceForm.get("farmer")?.value) && (x.pond && x.pond._id === this.weeklyPerformanceForm.get("pondNo")?.value));
        if(this.stockFilterdata && this.stockFilterdata.length > 0 && this.weeklySamplingFilterdata && this.weeklySamplingFilterdata.length >0){
          this.totalBioMass = this.weeklySamplingFilterdata[0].expectedSurvivalPercentage * this.stockFilterdata[0].plCount * this.weeklySamplingFilterdata[0].averageBodyWeight;
        }
      }
    });

    this.store.select(selectsalesPrice).subscribe(res => {
      if (res) {
        this.salesPriceFilterdata = res.filter((x: any) => (x.owner && x.owner._id === this.weeklyPerformanceForm.get("owner")?.value) && (x.farmer && x.farmer._id === this.weeklyPerformanceForm.get("farmer")?.value) && (x.pond && x.pond._id === this.weeklyPerformanceForm.get("pondNo")?.value));
        
      }
    })
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  ngOnDestroy() {
    if (this.weeklyPerformanceSubscriptions && this.weeklyPerformanceSubscriptions.length > 0) {
      this.weeklyPerformanceSubscriptions.forEach(res => {
        res.unsubscribe();
      });
    }
  }

}
