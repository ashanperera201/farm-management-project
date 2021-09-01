import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ReportingService } from '../../../shared/services/reporting.service';
import { FileService } from '../../../shared/services/file.service';


@Component({
  selector: 'app-application-detail-report',
  templateUrl: './application-detail-report.component.html',
  styleUrls: ['./application-detail-report.component.scss']
})
export class ApplicationDetailReportComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;

  pageSize: number = 10;
  page: any = 1;
  applicationDetailSubscriptions: Subscription[] = [];

  applicationDetailList: any[] = [];

  constructor(private reportingService: ReportingService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchApplicationReport();
  }

  fetchApplicationReport = () => {
    this.blockUI.start('Fetching data....');
    this.applicationDetailSubscriptions.push(this.reportingService.getApplicationDetailsReportData(null).subscribe(applicationReportDetail => {
      if (applicationReportDetail && applicationReportDetail.validity) {
        this.applicationDetailList = applicationReportDetail.result;
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    }))
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.applicationDetailList.map(x => {
      return {
        'Application Type': x.applicationType,
        'Name': x.applicantName,
        'Unit (KG/Liters)': x.unit,
        'Cost Per Unit': x.costPerUnit,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Application Type', 'Name', 'Unit (KG/Liters)', 'Cost Per Unit', 'Created On',];
    this.fileService.exportToPDF("Application Data", headers, pdfData, 'application_data', 'application details - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.applicationDetailSubscriptions && this.applicationDetailSubscriptions.length > 0) {
      this.applicationDetailSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
