import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ReportingService {

  private baseUrl: string = `${environment.baseUrl}/api/v1`;

  constructor(private httpClient: HttpClient) { }

  getClubMemberReportData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/club-member`;
    return this.httpClient.post(url, filterationPayload);
  }

  getFarmReportData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/farm-detail`;
    return this.httpClient.post(url, filterationPayload);
  }

  getPondReportData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/pond-detail`;
    return this.httpClient.post(url, filterationPayload);
  }

  getPondBrandDetailReportData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/pond-brand-detail`;
    return this.httpClient.post(url, filterationPayload);
  }

  getApplicationDetailsReportData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/applcation-detail`;
    return this.httpClient.post(url, filterationPayload);
  }

  getPercentageFeedingReportData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/percentage-feeding-detail`;
    return this.httpClient.post(url, filterationPayload);
  }

  getSalesReportingData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/sales-price-details`;
    return this.httpClient.post(url, filterationPayload);
  }

  awbFilteringReportingData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/awb-filtering`;
    return this.httpClient.post(url, filterationPayload);
  }

  weeklySampleReportingData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/weekly-sample`;
    return this.httpClient.post(url, filterationPayload);
  }

  weeklyApplicationReportingData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/weekly-application`;
    return this.httpClient.post(url, filterationPayload);
  }

  harvestReportingData = (filterationPayload: any): Observable<any> => {
    let url: string = `${this.baseUrl}/reporting/harvest-details`;
    return this.httpClient.post(url, filterationPayload);
  }
}
