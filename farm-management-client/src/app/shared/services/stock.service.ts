import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockModel } from '../models/stock-model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchStock(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/stock/details`;
    return this.http.get(url);
  }

  fetchStockDataById(stockId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/stock/${stockId}`;
    return this.http.get(url);
  }

  saveStock(stockData: StockModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/stock/create`;
    return this.http.post(url, stockData)
  }

  updateStock(stockData: StockModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/stock/update`;
    return this.http.put(url, stockData)
  }

  deleteStock(stockDetailIds: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/stock/delete`;
    return this.http.post(url, stockDetailIds)
  }
}
