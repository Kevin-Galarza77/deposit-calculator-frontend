import { HeaderService } from '../../pages/services/headers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../../pages/services/GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private headers: HeaderService) { }

  login(user: any): Observable<any> {
    return this.headers.http.post(`${GLOBAL.url}login`, user);
  }

}
