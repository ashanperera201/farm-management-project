import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';

@Component({
  selector: 'app-awb-detail-report',
  templateUrl: './awb-detail-report.component.html',
  styleUrls: ['./awb-detail-report.component.scss']
})
export class AwbDetailReportComponent implements OnInit, OnDestroy {
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
        'Club Member': x.owner.firstName,
        'Farm': x.farmer.farmName,
        'Pond Number': x.pond.pondNo,
        'AWB': x.averageBodyWeight,
        'DOC': x.dateOfCulture,
        'Total Bio Mass': ('under maintanance'),
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Club Member', 'Farm', 'Pond Number', 'AWB', 'DOC', 'Total Bio Mass', 'Created On',];
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
