import { HeaderService } from './headers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditPeopleService {

  constructor(private headers: HeaderService) { }

  getAllPeople(): Observable<any> {
    return this.headers.http.get(`${this.headers.url}credit-people/AllPeople`, this.headers.httpOptions);
  }

  getAllOnlyPeople(): Observable<any> {
    return this.headers.http.get(`${this.headers.url}credit-people/AllOnlyPeople`, this.headers.httpOptions);
  }

  createPerson(person: any): Observable<any> {
    return this.headers.http.post(`${this.headers.url}credit-people`, person, this.headers.httpOptions);
  }

  updatePerson(person: any): Observable<any> {
    return this.headers.http.put(`${this.headers.url}credit-people/${person.credit_people_id}`, person, this.headers.httpOptions);
  }

}
