import { HeaderService } from './headers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeeksService {

  constructor(private headers: HeaderService) { }

  getAllWeeks(): Observable<any> {
    return this.headers.http.get(`${this.headers.url}week/AllWeeks`, this.headers.httpOptions);
  }

  createWeek(week: any): Observable<any> {
    return this.headers.http.post(`${this.headers.url}week`, week, this.headers.httpOptions);
  }

  updateWeek(week: any): Observable<any> {
    return this.headers.http.put(`${this.headers.url}week/${week.week_id}`, week, this.headers.httpOptions);
  }

  deleteWeek(week_id: any): Observable<any> {
    return this.headers.http.delete(`${this.headers.url}week/${week_id}`, this.headers.httpOptions);
  }

}
