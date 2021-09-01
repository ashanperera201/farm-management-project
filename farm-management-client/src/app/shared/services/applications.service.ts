import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationModel } from '../models/application-model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  fetchApplications(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/applications/details`;
    return this.http.get(url);
  }
  
  fetchApplicationById(applicationId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/applications/${applicationId}`;
    return this.http.get(url);
  }
  
  saveApplication(applicationData: ApplicationModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/applications/create`;
    return this.http.post(url, applicationData);
  }

  updateApplication(applicationData: ApplicationModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/applications/update`;
    return this.http.put(url, applicationData);
  }

  deleteApplication(applicationIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/applications/delete`;
    return this.http.post(url, applicationIds);
  }
}
