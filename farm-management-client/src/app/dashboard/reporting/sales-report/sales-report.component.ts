import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ReportingService } from '../../../shared/services/reporting.service';
import { FileService } from '../../../shared/services/file.service';


@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;

  pageSize: number = 10;
  page: any = 1;
  salesDetailSubscription: Subscription[] = [];

  sales: any[] = [];

  constructor(private reportingService: ReportingService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchApplicationReport();
  }

  fetchApplicationReport = () => {
    this.blockUI.start('Fetching data....');
    this.salesDetailSubscription.push(this.reportingService.getSalesReportingData(null).subscribe(sales => {
      if (sales && sales.validity) {
        this.sales = sales.result;
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    }))
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.sales.map(x => {
      return {
        'AWB': x.averageBodyWeight,
        'Sales Price': x.salesPrice,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['AWB', 'Sales Price', 'Created On',];
    this.fileService.exportToPDF("Sales Report Data", headers, pdfData, 'sales_data', 'sales details - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.salesDetailSubscription && this.salesDetailSubscription.length > 0) {
      this.salesDetailSubscription.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
