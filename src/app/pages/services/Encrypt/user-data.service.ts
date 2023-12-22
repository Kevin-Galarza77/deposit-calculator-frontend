import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private localStorageService: LocalStorageService) { }

  saveEmail(id: string) {
    localStorage.setItem('e', this.localStorageService.encrypt(id));
  }

  saveUser(user: string) {
    localStorage.setItem('u', this.localStorageService.encrypt(user));
  }

  saveRol(rol: string) {
    localStorage.setItem('r', this.localStorageService.encrypt(rol));
  }

  getEmail() {
    try {
      return Number(this.localStorageService.decrypt(String(localStorage.getItem('e'))));
    } catch (error) {
      return -1;
    }
  }

  getRol() {
    try {
      return Number(this.localStorageService.decrypt(String(localStorage.getItem('r'))));
    } catch (error) {
      return -1;
    }
  }

  getUser() {
    try {
      return this.localStorageService.decrypt(String(localStorage.getItem('u')));
    } catch (error) {
      return -1;
    }
  }

}
