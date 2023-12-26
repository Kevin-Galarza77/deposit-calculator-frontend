import { HeaderService } from './headers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeekDetailsService {

  constructor(private headers: HeaderService) { }

  getAllWeekDetailsByWeek(week_id: any): Observable<any> {
    return this.headers.http.get(`${this.headers.url}week-detail/AllWeekDetailsByWeek?week=${week_id}`, this.headers.httpOptions);
  }

}
