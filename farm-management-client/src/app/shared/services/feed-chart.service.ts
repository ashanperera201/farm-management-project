import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FeedChartModel } from '../models/feed-chart-model';

@Injectable({
  providedIn: 'root'
})
export class FeedChartService {


  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchFeedCharts(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feed-chart/details`;
    return this.http.get(url);
  }

  saveFeedChart(feedBandData: FeedChartModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feed-chart/create`;
    return this.http.post(url, feedBandData);
  }

  updateFeedChart(feedBandData: FeedChartModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feed-chart/update`;
    return this.http.put(url, feedBandData);
  }

  deleteFeedCharts(feedBandIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feed-chart/delete`;
    return this.http.post(url, feedBandIds);
  }
}