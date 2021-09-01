import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { pondModel } from '../models/pond-model';

@Injectable({
  providedIn: 'root'
})
export class PondService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchPonds(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/pond-management/details`;
    return this.http.get(url);
  }

  fetchPondDataById(pondId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/pond-management/${pondId}`;
    return this.http.get(url);
  }

  savePond(pondData: pondModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/pond-management/create`;
    return this.http.post(url, pondData)
  }

  updatePond(pondData: pondModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/pond-management/update`;
    return this.http.put(url, pondData)
  }

  deletePonds(pondDetailIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/pond-management/delete`;
    return this.http.post(url, pondDetailIds)
  }
}
