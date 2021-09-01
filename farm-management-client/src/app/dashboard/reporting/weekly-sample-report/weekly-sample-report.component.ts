import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';

@Component({
  selector: 'app-weekly-sample-report',
  templateUrl: './weekly-sample-report.component.html',
  styleUrls: ['./weekly-sample-report.component.scss']
})
export class WeeklySampleReportComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;
  pageSize: number = 10;
  page: any = 1;
  weeklySamplingSubscriptions: Subscription[] = [];
  weeklySamplings: any[] = [];

  constructor(private reportingService: ReportingService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchReportDetails();
  }

  private fetchReportDetails = () => {
    this.blockUI.start('Fetching data....');
    this.weeklySamplingSubscriptions.push(this.reportingService.weeklySampleReportingData(null).subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.weeklySamplings = serviceResult.result;
      }
      this.blockUI.stop();
    }, (e) => {
      this.blockUI.stop();
    }));
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.weeklySamplings.map(x => {
      return {
        'DOC': x.dateOfCulture,
        'Total Weight': x.totalWeight,
        'Total Shrimp': x.totalShrimp,
        'AWB': x.averageBodyWeight,
        'Previous AWB': x.previousAwb,
        'Gain in Weight': x.gainInWeight,
        'Expected Survival %': x.expectedSurvivalPercentage,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['DOC', 'Total Weight', 'Total Shrimp', 'Previous AWB', 'Gain in Weight', 'Expected Survival %', 'Created On',];
    this.fileService.exportToPDF("Weekly Sample Report Data", headers, pdfData, 'weekly_sample_report', 'Weekly Sample Report Details - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.weeklySamplingSubscriptions && this.weeklySamplingSubscriptions.length > 0) {
      this.weeklySamplingSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
