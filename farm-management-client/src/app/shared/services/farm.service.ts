import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { clubMemberModel } from '../models/club-member-model';
import { farmModel } from '../models/farm-model';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  fetchFarms(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/farm-management/details`;
    return this.http.get(url);
  }

  fetchFarmByfarmer(farmer: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/farm-management/${farmer}`;
    return this.http.get(url);
  }

  fetchFarmByowner(owner: number): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/farm-management`+ owner;
    return this.http.get(url);
  }

  saveFarm(farmData: farmModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/farm-management/create`;
    return this.http.post(url, farmData);
  }

  updateFarm(farmData: farmModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/farm-management/update`;
    return this.http.put(url, farmData);
  }

  deleteFarms(farmDetailIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/farm-management/delete`;
    return this.http.post(url, farmDetailIds);
  }
}
