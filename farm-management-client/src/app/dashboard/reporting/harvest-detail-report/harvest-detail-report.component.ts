import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms'
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';
import { PondService } from '../../../shared/services/pond.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';

@Component({
  selector: 'app-harvest-detail-report',
  templateUrl: './harvest-detail-report.component.html',
  styleUrls: ['./harvest-detail-report.component.scss']
})
export class HarvestDetailReportComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;
  pageSize: number = 10;
  page: any = 1;
  harvestSubscriptions: Subscription[] = [];
  harvestDetails: any[] = [];
  initialHavestDetails: any[] = [];

  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];

  filterForm!: FormGroup;

  constructor(
    private reportingService: ReportingService,
    private fileService: FileService,
    private pondService: PondService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService) { }

  ngOnInit(): void {
    this.fetchInitialData();
    this.initFilterForm();
    this.fetchReportDetails();
  }

  private initFilterForm = () => {
    this.filterForm = new FormGroup({
      owner: new FormControl(null),
      farmer: new FormControl(null),
      pond: new FormControl(null),
    });
  }

  private fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.harvestSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
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

  private fetchReportDetails = () => {
    this.blockUI.start('Fetching data....');
    this.harvestSubscriptions.push(this.reportingService.harvestReportingData(null).subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.harvestDetails = serviceResult.result;
        this.initialHavestDetails = serviceResult.result;
      }
      this.blockUI.stop();
    }, (e) => {
      this.blockUI.stop();
    }));
  }

  filterChange = (event: any) => {
    this.harvestDetails = this.initialHavestDetails;
    const owner = this.filterForm.get("owner")?.value;
    const farmer = this.filterForm.get("farmer")?.value;
    const pond = this.filterForm.get("pond")?.value;

    if (owner) {
      this.harvestDetails = this.harvestDetails.filter(x => x.owner._id === owner);
    }
    if (farmer) {
      this.harvestDetails = this.harvestDetails.filter(x => x.farmer._id === farmer);
    }
    if (pond) {
      this.harvestDetails = this.harvestDetails.filter(x => x.pond._id === pond);
    }
  }


  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.harvestDetails.map(x => {
      return {
        'Harvest Date': x.harvestDate,
        'Harvest Type': x.harvestType,
        'Harvest Qty': x.harvestQuantity,
        'Harvest AWB': x.harvestAWB,
        'No.of PL\'s Harvested': x.harvestQuantity / x.harvestAWB,
        'sales price': x.harvestSalePrice,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Harvest Date', 'Harvest Type', 'Harvest Qty', 'Harvest AWB', 'No.of PL\'s Harvested', 'sales price', 'Created On'];
    this.fileService.exportToPDF("Harvest Report Data", headers, pdfData, 'harvest_report', 'Harvest Report Details - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.harvestSubscriptions && this.harvestSubscriptions.length > 0) {
      this.harvestSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
