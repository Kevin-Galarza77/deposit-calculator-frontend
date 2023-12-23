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

}
