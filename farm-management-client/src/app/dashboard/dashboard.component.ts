import { DailyFeedService } from './../shared/services/daily-feed.service';
import { FarmService } from './../shared/services/farm.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Store } from '@ngrx/store';
import { NavigationModes } from '../shared/enums/navigation.enum';
import { StockService } from '../shared/services/stock.service';
import { ClubMemberService } from '../shared/services/club-member.service';
import { LoggedUserService } from '../shared/services/logged-user.service';
import { WeeklySamplingService } from '../shared/services/weekly-sampling.service';
import { AppState, selectUserDetails, setClubMember, setDailyFeed, setFarmManagement, setSalesPrice, setStockDetails, setWeeklySamplings } from '../redux';
import { SalesPriceService } from '../shared/services/sales-price.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  navigationModes = NavigationModes;
  asideMenuDropdown: any = 1;
  asideMenuScroll = 1;
  loggedUserName: string = '';

  menuItems: any[] = [];
  currentIndex!: number;
  dashboardSubscriptions: Subscription[] = [];
  config: PerfectScrollbarConfigInterface = {};

  constructor(
    private store: Store<AppState>,
    private stockService: StockService,
    private clubMemberService: ClubMemberService,
    private weeklySamplingService: WeeklySamplingService,
    private loggedUserService: LoggedUserService,
    private salesPriceService: SalesPriceService,
    private dailyFeedService: DailyFeedService,
    private farmService: FarmService,
  ) { }

  ngOnInit(): void {
    this.fetchUser()
    this.fetchInitialDataSets();
  }

  fetchUser = () => {
    this.store.select(selectUserDetails).subscribe(user => {
      if (user) {
        this.loggedUserName = user.firstName;
      }
    })
  }

  fetchInitialDataSets = () => {
    this.dashboardSubscriptions.push(this.stockService.fetchStock().pipe(switchMap(stockDetails => {
      if (stockDetails && stockDetails.validity) {
        const details = stockDetails.result;
        this.store.dispatch(setStockDetails(details));
      }
      return this.weeklySamplingService.getAllWeeklySamplings();
    })).pipe(switchMap((weeklySampling: any) => {
      if (weeklySampling && weeklySampling.validity) {
        const samplingDetails = weeklySampling.result;
        this.store.dispatch(setWeeklySamplings(samplingDetails));
      }
      return this.farmService.fetchFarms()
    })).pipe(switchMap((farmData: any) => {
      if (farmData && farmData.result) {
        this.store.dispatch(setFarmManagement(farmData.result));
      }
      return this.salesPriceService.fetchSalesPrice()
    })).pipe(switchMap((salesData: any) => {
      if (salesData && salesData.result) {
        this.store.dispatch(setSalesPrice(salesData.result));
      }
      return this.dailyFeedService.fetchDailyFeeds()
    })).pipe(switchMap((dailyFeedData: any) => {
      if(dailyFeedData && dailyFeedData.result){
        this.store.dispatch(setDailyFeed(dailyFeedData.result));
      }
      return this.clubMemberService.fetchClubMembers()
    })).subscribe((clubMembersData: any) => {
      if(clubMembersData && clubMembersData.result){
        this.store.dispatch(setClubMember(clubMembersData.result));
      }
    }));
  }

  onMenuItemClick = (index: number) => {
    if (this.currentIndex >= 0) {
      this.menuItems[this.currentIndex].selected = !this.menuItems[this.currentIndex].selected;
      this.menuItems[this.currentIndex].activeClass = '';
      this.currentIndex = -1;
    }
    this.menuItems[index].selected = !this.menuItems[index].selected;
    this.menuItems[index].activeClass = this.menuItems[index].selected ? 'menu-item-active' : '';
    this.currentIndex = index;
  }

  signOut = () => {
    this.loggedUserService.signOut();
  }

  ngOnDestroy() {
    if (this.dashboardSubscriptions && this.dashboardSubscriptions.length > 0) {
      this.dashboardSubscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }

}
