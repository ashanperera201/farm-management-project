import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';
@Component({
  selector: 'app-club-member-report',
  templateUrl: './club-member-report.component.html',
  styleUrls: ['./club-member-report.component.scss']
})
export class ClubMemberReportComponent implements OnInit, OnDestroy {


  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;
  exportTypes = ExportTypes;

  pageSize: number = 10;
  page: any = 1;
  clubMemberReportSubscriptions: Subscription[] = [];
  clubMemberList: any[] = [];


  test: any[] = [
    {
      'id': '5a15b13c36e7a7f00cf0d7cb',
      'index': 2,
      'isActive': true,
      'picture': 'http://placehold.it/32x32',
      'age': 23,
      'name': 'Karyn Wright',
      'gender': 'female',
      'company': 'ZOLAR',
      'email': 'karynwright@zolar.com',
      'phone': '+1 (851) 583-2547'
    },
    {
      'id': '5a15b13c2340978ec3d2c0ea',
      'index': 3,
      'isActive': false,
      'picture': 'http://placehold.it/32x32',
      'age': 35,
      'name': 'Rochelle Estes',
      'disabled': true,
      'gender': 'female',
      'company': 'EXTRAWEAR',
      'email': 'rochelleestes@extrawear.com',
      'phone': '+1 (849) 408-2029'
    },
  ]

  constructor(private reportingService: ReportingService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchClubMemberReportData();
  }

  private fetchClubMemberReportData = () => {
    this.blockUI.start('Fetching data....');
    this.clubMemberReportSubscriptions.push(this.reportingService.getClubMemberReportData(null).subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.clubMemberList = serviceResult.result;
      }
      this.blockUI.stop();
    }, (e) => {
      this.blockUI.stop();
    }));
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.clubMemberList.map(x => {
      return {
        'First Name': x.firstName,
        'Last Name': x.lastName,
        'Email': x.email,
        'Nic': x.nic,
        'Contact No': x.contactNumber,
        'Address': x.address,
        'City': x.city,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['First Name', 'Last Name', 'Email', 'Contact No', 'Nic', 'Created On',];
    this.fileService.exportToPDF("Club Members Data", headers, pdfData, 'Club_Members_Data', 'club member details - Taprobane Seafood (Pvt) Ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.clubMemberReportSubscriptions && this.clubMemberReportSubscriptions.length > 0) {
      this.clubMemberReportSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
