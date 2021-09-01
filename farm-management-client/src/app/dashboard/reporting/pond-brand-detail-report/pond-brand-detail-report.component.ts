import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';
@Component({
  selector: 'app-pond-brand-detail-report',
  templateUrl: './pond-brand-detail-report.component.html',
  styleUrls: ['./pond-brand-detail-report.component.scss']
})
export class PondBrandDetailReportComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;

  pageSize: number = 10;
  page: any = 1;
  brandSubscriptions: Subscription[] = [];
  brandDetailList: any[] = [];

  constructor(private reportingService: ReportingService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchBrandDetails();
  }

  private fetchBrandDetails = () => {
    this.blockUI.start('Fetching data....');
    this.brandSubscriptions.push(this.reportingService.getPondBrandDetailReportData(null).subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.brandDetailList = serviceResult.result;
      }
      this.blockUI.stop();
    }, (e) => {
      this.blockUI.stop();
    }));
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');

    const pdfData: any[] = this.brandDetailList.map(x => {
      return {
        'Brand Name': x.brandName,
        'Grades': x.grades,
        'Shrimp Weight': x.shrimpWeight,
        'Price': x.price,
        'status': x.isActive ? 'Active' : 'In-Active',
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Brand Name', 'Grades', 'Shrimp Weight', 'Price', 'status', 'Created On'];
    this.fileService.exportToPDF("Brand Detail Report", headers, pdfData, 'brand_details_report', 'brand details, - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.brandSubscriptions && this.brandSubscriptions.length > 0) {
      this.brandSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }

}
