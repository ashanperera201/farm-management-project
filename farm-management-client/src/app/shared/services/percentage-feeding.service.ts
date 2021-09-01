import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PercentageFeedModel } from '../models/percentage-feed-modal';

@Injectable({
  providedIn: 'root'
})
export class PercentageFeedingService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchPercentageFeedings(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feeding-percentage/details`;
    return this.http.get(url);
  }

  fetchPercentageFeedingDataById(pfId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feeding-percentage/${pfId}`;
    return this.http.get(url);
  }

  savePercentageFeeding(percentageFeedingData: PercentageFeedModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feeding-percentage/create`;
    return this.http.post(url, percentageFeedingData)
  }

  updatePercentageFeeding(percentageFeedingData: PercentageFeedModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feeding-percentage/update`;
    return this.http.put(url, percentageFeedingData)
  }

  deletePercentageFeeding(feedingPercentageIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feeding-percentage/delete`;
    return this.http.post(url, feedingPercentageIds)
  }
}
