import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { AppState, selectClubMember, selectDailyFeed, selectFarmManagement, selectStockDetails, selectWeeklySamplings } from '../../../redux';
import { FeedBrandService } from './../../../shared/services/feed-brand.service';
import { SalesPriceService } from './../../../shared/services/sales-price.service';
import { PondService } from '../../../shared/services/pond.service';
import { WeeklyApplicationsService } from '../../../shared/services/weekly-applications.service';

@Component({
  selector: 'app-weekly-performance-report',
  templateUrl: './weekly-performance-report.component.html',
  styleUrls: ['./weekly-performance-report.component.scss']
})
export class WeeklyPerformanceReportComponent implements OnInit {

  @Input() initialData: any;

  @BlockUI() blockUI!: NgBlockUI;

  ownerForm!: FormGroup;
  owner!: any;
  farm!: any;
  pond!: any;
  week!: any;
  stock!: any;
  preWeekStock!: any;
  reportSubscription: Subscription[] = [];
  applicationList: any[] = [];
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  stockList: any[] = [];
  salesList: any[] = [];
  preWeekStockList: any[] = [];
  prevWeekSalesList: any[] = [];
  dailyFeedList: any[] = [];
  weeklyApplicationList: any[] = [];

  //Report Data Weekly Sales
  gainInWeight: number = 0;
  totalBioMass: number = 0;
  expectedSurvivalPercentage: number = 0;
  averageBodyWeight: number = 0;
  salesPricePerABW: number = 0;
  noOfPl: number = 0;
  totalBioMassGain: number = 0;
  bioMassOnAverage: number = 0;
  weeklyBioMassValueGain: any;
  fromDate!: any;
  previousWeekFromDate!: any;
  previousWeekToDate!: any;

  //Previous Week Data
  prevWeekExpectedSurvivalPercentage: number = 0;
  prevWeekBioMass: number = 0;
  preWeekAverageBodyWeight: number = 0;
  preWeekBioMassOnAverage: number = 0;

  //Report Data Weekly Cost
  totalFeed: number = 0;
  weeklyFcr: number = 0;
  FcrToDate: number = 0;
  totalFeedCostWeekly: number = 0;

  applicationGrandTotal: number = 0;
  dailyFeedTotal: number = 0;
  totalFeedKilloPerWeek: number = 0;
  totalFeedUptoDate: number = 0;
  totalFeedCost: number = 0;
  feedBrandUnitPrice: number = 1;

  //Report Data after Application table
  otherCost: number = 0;
  plCost: number = 0;
  totalCost: number = 0;
  weeklyProfit: number = 0;
  profit: number = 0;
  plPrice: number = 0;
  plCount: number = 0;
  preWeekPlCount: number = 0;
  totalApllicationCost: number = 0;

  constructor(
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private pondService: PondService,
    private salesPriceService: SalesPriceService,
    private feedBrandService: FeedBrandService,
    private weeklyApplicationsService: WeeklyApplicationsService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.fetchInputData();
    this.fetchInitialData();
    this.fetchWeeklyApplications();
  }

  fetchInputData = () => {
    this.week = this.initialData?.weekNumber;
    let today = new Date();
    let days = this.initialData?.weekNumber * 7;
    today.setDate(today.getDate() - days);
    this.fromDate = moment(today).format('YYYY-MM-DD');
    this.previousWeekFromDate = moment(today.setDate(today.getDate() - (days - 7))).format('YYYY-MM-DD');
    this.previousWeekToDate = moment(this.fromDate).format('YYYY-MM-DD');
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Report Data...');
    this.reportSubscription.push(this.store.select(selectClubMember).pipe(switchMap((ownerRes: any) => {
      if (ownerRes) {
        this.ownerList = ownerRes;
        this.owner = this.ownerList.filter(x => x._id == this.initialData?.owner)[0];
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondList = resPonds.result;
        this.pond = this.pondList.filter(x => x._id == this.initialData?.pondNo)[0];
      }
      return this.store.select(selectStockDetails)
    })).pipe(switchMap((resStock: any) => {
      if (resStock) {
        // resStock.array.forEach((z:any) => {
        //   this.otherCost = this.otherCost + z.otherCost;
        //   this.plCost = this.plCost + z.plPrice;
        // });
        this.stockList = resStock.filter((x: any) => x.pond?._id == this.initialData?.pondNo && new Date(x.createdOn) > new Date(this.fromDate));
        this.preWeekStockList = resStock.filter((z: any) => z.pond?._id == this.initialData?.pondNo && new Date(z.createdOn) > new Date(this.previousWeekFromDate)
          && new Date(z.createdOn) < new Date(this.previousWeekToDate));
        this.stock = this.stockList[0];
        this.preWeekStock = this.preWeekStockList[0];
        if(this.stock){
          this.plCount = this.stock.plCount;
          this.plPrice = this.stock.plPrice;
        }
        if(this.preWeekStock){
          this.preWeekPlCount = this.preWeekStock.plCount;
        }
        if(!this.stock){
          this.toastrService.warning("No Stock Data for Selected inputs","No Data Available");
          this.closeModal();
          this.blockUI.stop();
        }
      }
      return this.salesPriceService.fetchSalesPrice()
    })).pipe(switchMap((resSales: any) => {
      if (resSales && resSales.result) {
        this.salesList = resSales.result;
      }
      return this.store.select(selectDailyFeed)
    })).pipe(switchMap((resDailyFeed: any) => {
      if (resDailyFeed) {
        resDailyFeed.forEach((x: any) => {
          this.totalFeedUptoDate = this.totalFeedUptoDate + x.calculatedDailyFeed;
          this.totalFeedCost = this.totalFeed + x.calculatedDailyFeed;
        });
        this.dailyFeedList = resDailyFeed.filter((x: any) => x.pond?._id == this.initialData?.pondNo && new Date(x.createdOn) > new Date(this.fromDate));
      }
    // Unable to find a reletionship with feed brand // TO DO  
    //   return this.feedBrandService.fetchFeedBands();
    // })).pipe(switchMap((resFeedBrand: any) => {
    //   if (resFeedBrand && resFeedBrand.result) {
    //   }
      return this.store.select(selectFarmManagement)
    })).subscribe((farmRes: any) => {
      if (farmRes) {
        this.farmList = farmRes;
        if(this.farmList && this.farmList.length > 0){
          this.farm = this.farmList.filter(x => x._id == this.initialData?.farmer)[0];
        }
      }
      this.fetchApplicationData();
      this.calcWeeklyCost();
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Unable to fetch all data", "Error");
    }));
  }

  fetchApplicationData = () => {
    this.reportSubscription.push(this.store.select(selectWeeklySamplings).subscribe(res => {
      if (res) {
        res = res.filter((z: any) => z.pond?._id == this.initialData?.pondNo && new Date(z.createdOn) > new Date(this.fromDate));
        res.forEach((x: any) => {
          this.gainInWeight = this.gainInWeight + Number.parseInt(x.gainInWeight);
          this.expectedSurvivalPercentage = this.expectedSurvivalPercentage + x.expectedSurvivalPercentage;
          this.averageBodyWeight = this.averageBodyWeight + x.averageBodyWeight;
          let awb = this.salesList.filter(y => y.averageBodyWeight == x.averageBodyWeight)[0];
          if (awb) {
            this.salesPricePerABW = this.salesPricePerABW + awb.salesPrice;
          }
        });

        const prevWeek = res.filter((z: any) => z.pond?._id == this.initialData?.pondNo && new Date(z.createdOn) > new Date(this.previousWeekFromDate)
          && new Date(z.createdOn) < new Date(this.previousWeekToDate));

        //Previous Week Data
        if (prevWeek && prevWeek.length > 0) {
          prevWeek.forEach((x: any) => {
            this.prevWeekExpectedSurvivalPercentage = this.prevWeekExpectedSurvivalPercentage + x.expectedSurvivalPercentage;
            this.preWeekAverageBodyWeight = this.preWeekAverageBodyWeight + x.averageBodyWeight;
            let awb = this.salesList.filter(y => y.averageBodyWeight == x.averageBodyWeight)[0];
            if (awb) {
              this.salesPricePerABW = this.salesPricePerABW + awb.salesPrice;
            }
          });
        }
      }
      else{
        this.toastrService.warning("No Weekly Sampling Data for Selected inputs","No Data Available");
        this.closeModal();
        this.blockUI.stop();
      }
    }, () => {
      this.toastrService.error("Unable to fetch Application data", "Error");
    }));

    this.totalBioMass = (this.expectedSurvivalPercentage * this.averageBodyWeight * this.plCount);
    //this.salesPricePerABW = this.salesList.filter(y => y.averageBodyWeight == this.averageBodyWeight)[0].salesPrice;
    this.bioMassOnAverage = this.salesPricePerABW * this.totalBioMass;
    this.otherCost = this.totalBioMass * this.pond.fixedCost;
    this.plCost = this.plCount * this.plPrice;
    this.preWeekBioMassOnAverage = this.salesPricePerABW * this.prevWeekBioMass;
    if(this.preWeekStock){
      this.prevWeekBioMass = (this.prevWeekExpectedSurvivalPercentage * this.preWeekAverageBodyWeight * this.preWeekPlCount);
    }
  }

  calcWeeklyCost = () => {
    if (this.dailyFeedList.length > 0) {
      this.dailyFeedList.forEach((x: any) => {
        this.dailyFeedTotal = this.dailyFeedTotal + x.calculatedDailyFeed;
      })
    }
  }

  fetchWeeklyApplications = () => {
    this.reportSubscription.push(this.weeklyApplicationsService.getAllWeeklyApplication().subscribe((res: any) => {
      if (res && res.result) {
        res.result.forEach((z: any) => {
          if (res.result) {
            let cost = z.application.costPerUnit * z.application.unit;
            this.totalApllicationCost = this.totalApllicationCost + cost;
          }
        });
        this.weeklyApplicationList = res.result.filter((x: any) => x.createdOn > this.fromDate);
      }
    }));
  }

  closeModal = () => {
    this.activeModal.close();
  }

  ngOnDestroy() {
    if (this.reportSubscription && this.reportSubscription.length > 0) {
      this.reportSubscription.forEach(s => {
        s.unsubscribe();
      });
    }
  }

}
