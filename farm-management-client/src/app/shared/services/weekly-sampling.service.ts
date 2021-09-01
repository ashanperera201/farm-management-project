import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WeeklySamplingService {

  private baseUrl: string = `${environment.baseUrl}/api/v1`;

  constructor(private httpClient: HttpClient) { }

  getAllWeeklySamplings = (): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-sampling/details`;
    return this.httpClient.get(url);
  }

  getWeeklySampling = (samplingUniqueId: string): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-sampling/${samplingUniqueId}`;
    return this.httpClient.get(url);
  }

  createWeeklySamplings = (samplingCollection: any[]): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-sampling/create-collection`;
    return this.httpClient.post(url, samplingCollection);
  }

  createWeeklySampling = (weeklySampling: any): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-sampling/create`;
    return this.httpClient.post(url, weeklySampling);
  }

  updateWeeklySampling = (weeklySampling: any): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-sampling/update`;
    return this.httpClient.put(url, weeklySampling);
  }

  deleteWeeklySampling = (formData: FormData): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-sampling/delete`;
    return this.httpClient.post(url, formData);
  }
}
