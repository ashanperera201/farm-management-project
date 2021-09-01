import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesPriceService {

  private baseUrl: string = `${environment.baseUrl}/api/v1`;

  constructor(private httpClient: HttpClient) { }

  fetchSalesPrice = (): Observable<any> => {
    const url: string = `${this.baseUrl}/sales/details`;
    return this.httpClient.get(url);
  }

  fetchSalesPriceById = (salesUniqueId: string): Observable<any> => {
    const url: string = `${this.baseUrl}/sales/${salesUniqueId}`;
    return this.httpClient.get(url);
  }

  saveSalesPriceCollection = (salesPriceCollection: any[]): Observable<any> => {
    const url: string = `${this.baseUrl}/sales/create-collection`;
    return this.httpClient.post(url, salesPriceCollection);
  }

  saveSalesPrice = (salesPrice: any): Observable<any> => {
    const url: string = `${this.baseUrl}/sales/create`;
    return this.httpClient.post(url, salesPrice);
  }

  updateSalesPrice = (salesPrice: any): Observable<any> => {
    const url: string = `${this.baseUrl}/sales/update`;
    return this.httpClient.put(url, salesPrice);
  }

  deleteSalesPrice = (formData: FormData): Observable<any> => {
    const url: string = `${this.baseUrl}/sales/delete`;
    return this.httpClient.post(url, formData);
  }
}
