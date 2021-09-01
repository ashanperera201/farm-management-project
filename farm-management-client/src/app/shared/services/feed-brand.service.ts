import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { feedBrandModel } from '../models/feed-brand-model';

@Injectable({
  providedIn: 'root'
})
export class FeedBrandService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchFeedBands(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feed-brand/details`;
    return this.http.get(url);
  }

  saveFeedBand(feedBandData: feedBrandModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feed-brand/create`;
    return this.http.post(url, feedBandData);
  }

  updateFeedBand(feedBandData: feedBrandModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feed-brand/update`;
    return this.http.put(url, feedBandData);
  }

  deleteFeedBands(feedBandIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/feed-brand/delete`;
    return this.http.post(url, feedBandIds);
  }

}
