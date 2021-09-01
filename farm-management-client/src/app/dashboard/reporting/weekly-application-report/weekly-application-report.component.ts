import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';

@Component({
  selector: 'app-weekly-application-report',
  templateUrl: './weekly-application-report.component.html',
  styleUrls: ['./weekly-application-report.component.scss']
})
export class WeeklyApplicationReportComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;
  pageSize: number = 10;
  page: any = 1;
  weeklyApplicationSubscriptions: Subscription[] = [];
  weeklyApplications: any[] = [];

  constructor(private reportingService: ReportingService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchReportDetails();
  }

  private fetchReportDetails = () => {
    this.blockUI.start('Fetching data....');
    this.weeklyApplicationSubscriptions.push(this.reportingService.weeklyApplicationReportingData(null).subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.weeklyApplications = serviceResult.result;
      }
      this.blockUI.stop();
    }, (e) => {
      this.blockUI.stop();
    }));
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.weeklyApplications.map(x => {
      return {
        'Week Number': x.weekNumber,
        'Application Type': x.application.applicationType,
        'Unit': x.unit,
        'Number Of Unit': x.numberOfUnit,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Week Number', 'Application Type', 'Unit', 'Number Of Unit', 'Created On',];
    this.fileService.exportToPDF("Weekly Application Report Data", headers, pdfData, 'weekly_application_report', 'Weekly Application Report Details - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.weeklyApplicationSubscriptions && this.weeklyApplicationSubscriptions.length > 0) {
      this.weeklyApplicationSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
