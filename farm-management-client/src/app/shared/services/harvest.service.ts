import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HarvestModel} from '../models/harvest-model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HarvestService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchHarvests(): Observable<any> {
    const url = `${this.baseUrl}/api/v1/harvest-management/details`;
    return this.http.get(url);
  }

  // fetchharvestByharvester(harvester: any): Observable<any> {
  //   const url: string = `${this.baseUrl}/api/v1/harvest-management/${harvester}`;
  //   return this.http.get(url);
  // }
  //
  // fetchharvestByowner(owner: number): Observable<any> {
  //   const url: string = `${this.baseUrl}/api/v1/harvest-management`+ owner;
  //   return this.http.get(url);
  // }

  saveHarvest(harvestData: HarvestModel): Observable<any> {
    const url = `${this.baseUrl}/api/v1/harvest-management/create`;
    return this.http.post(url, harvestData);
  }

  updateHarvest(harvestData: HarvestModel): Observable<any> {
    const url = `${this.baseUrl}/api/v1/harvest-management/update`;
    return this.http.put(url, harvestData);
  }

  deleteHarvest(harvestDetailIds: FormData): Observable<any> {
    const url = `${this.baseUrl}/api/v1/harvest-management/delete`;
    return this.http.post(url, harvestDetailIds);
  }
}
