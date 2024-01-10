import { HeaderService } from './headers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditDetailService {

  constructor(private headers: HeaderService) { }

  createCreditDetail(detail: any): Observable<any> {
    return this.headers.http.post(`${this.headers.url}credit-detail`, detail, this.headers.httpOptions);
  }

  updateCreditDetail(detail: any): Observable<any> {
    return this.headers.http.put(`${this.headers.url}credit-detail/${detail.id}`, detail, this.headers.httpOptions);
  }

  deleteCreditDetail(detail: any): Observable<any> {
    return this.headers.http.delete(`${this.headers.url}credit-detail/${detail}`, this.headers.httpOptions);
  }

}
