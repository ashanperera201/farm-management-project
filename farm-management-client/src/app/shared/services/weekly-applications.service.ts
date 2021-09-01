import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeeklyApplicationsService {

  private baseUrl: string = `${environment.baseUrl}/api/v1`;

  constructor(private httpClient: HttpClient) { }

  getAllWeeklyApplication = (): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-applications/details`;
    return this.httpClient.get(url);
  }

  getWeeklyApplication = (applicationUniqueId: string): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-application/${applicationUniqueId}`;
    return this.httpClient.get(url);
  }

  saveWeeklyApplicationCollection = (applicationCollection: any[]): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-applications/create-collection`;
    return this.httpClient.post(url, applicationCollection);
  }

  saveWeeklyApplication = (weeklyApplication: any): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-applications/create`;
    return this.httpClient.post(url, weeklyApplication);
  }

  updateWeeklyApplication = (weeklyApplication: any): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-applications/update`;
    return this.httpClient.put(url, weeklyApplication);
  }

  deleteWeeklyApplication = (formData: FormData): Observable<any> => {
    const url: string = `${this.baseUrl}/weekly-applications/delete`;
    return this.httpClient.post(url, formData);
  }
}
