import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportingService } from '../../../shared/services/reporting.service';
import { FileService } from '../../../shared/services/file.service';
import { PondService } from '../../../shared/services/pond.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';

@Component({
  selector: 'app-percentage-feeding-report',
  templateUrl: './percentage-feeding-report.component.html',
  styleUrls: ['./percentage-feeding-report.component.scss']
})
export class PercentageFeedingReportComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;
  percentageFeedingList: any[] = [];
  initialPercentageFeedingList: any[] = [];

  pageSize: number = 10;
  page: any = 1;
  feedingPercentageSubscriptions: Subscription[] = [];
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];

  filterForm!: FormGroup;

  constructor(
    private reportingService: ReportingService,
    private fileService: FileService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private pondService: PondService) { }

  ngOnInit(): void {
    this.fetchInitialData();
    this.fetchReportData();
    this.initFilterForm();
  }

  initFilterForm = () => {
    this.filterForm = new FormGroup({
      owner: new FormControl(null),
      farmer: new FormControl(null),
      pond: new FormControl(null),
    });
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.feedingPercentageSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.ownerList = ownerRes.result;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondList = resPonds.result;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.farmList = farmRes.result;
      }
    }))
    this.blockUI.stop();
  }

  fetchReportData = () => {
    this.blockUI.start('Fetching data....');
    this.feedingPercentageSubscriptions.push(this.reportingService.getPercentageFeedingReportData(null).subscribe(reportDetails => {
      if (reportDetails && reportDetails.validity) {
        this.percentageFeedingList = reportDetails.result;
        this.initialPercentageFeedingList = reportDetails.result;
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    }))
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.percentageFeedingList.map(x => {
      return {
        'AWB': x.averageBodyWeight,
        'Sales Price': x.feedPercentage,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['AWB', 'Sales Price', 'Created On',];
    this.fileService.exportToPDF("Feeding Percentage Data", headers, pdfData, 'Feeding Percentage_data', 'Feeding Percentage details - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  filterChange = (event: any) => {
    this.percentageFeedingList = this.initialPercentageFeedingList;
    const owner = this.filterForm.get("owner")?.value;
    const farmer = this.filterForm.get("farmer")?.value;
    const pond = this.filterForm.get("pond")?.value;

    if (owner) {
      this.percentageFeedingList = this.percentageFeedingList.filter(x => x.owner._id === owner);
    }
    if (farmer) {
      this.percentageFeedingList = this.percentageFeedingList.filter(x => x.farmer._id === farmer);
    }
    if (pond) {
      this.percentageFeedingList = this.percentageFeedingList.filter(x => x.pond._id === pond);
    }
  }


  ngOnDestroy() {
    if (this.feedingPercentageSubscriptions && this.feedingPercentageSubscriptions.length > 0) {
      this.feedingPercentageSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
