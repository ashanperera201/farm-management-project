import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';

@Component({
  selector: 'app-farm-detail-report',
  templateUrl: './farm-detail-report.component.html',
  styleUrls: ['./farm-detail-report.component.scss']
})
export class FarmDetailReportComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;

  pageSize: number = 10;
  page: any = 1;
  farmReportSubscriptions: Subscription[] = [];
  farmDetailList: any[] = [];

  constructor(private reportingService: ReportingService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchFarmDetails();
  }

  private fetchFarmDetails = () => {
    this.blockUI.start('Fetching data....');
    this.farmReportSubscriptions.push(this.reportingService.getFarmReportData(null).subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.farmDetailList = serviceResult.result;
      }
      this.blockUI.stop();
    }, (e) => {
      this.blockUI.stop();
    }));
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');

    const pdfData: any[] = this.farmDetailList.map(x => {
      return {
        'First Name': x.owner.firstName,
        'Last Name': x.owner.lastName,
        'Contact': x.contactNo,
        'Address': x.address,
        'Pond Count': x.pondCount,
        'status': x.isActive ? 'Active' : 'In-Active',
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['First Name', 'Last Name', 'Contact', 'Address', 'Pond Count', 'status', 'Created On',];
    this.fileService.exportToPDF("Farm Detail Data", headers, pdfData, 'farm_details_report', 'Farm details, - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.farmReportSubscriptions && this.farmReportSubscriptions.length > 0) {
      this.farmReportSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
