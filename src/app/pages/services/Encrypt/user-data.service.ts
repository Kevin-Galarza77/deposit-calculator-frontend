import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private email: any;
  private user: any;
  private rol: any;


  constructor(private localStorageService: LocalStorageService) {
    this.uploadDataLocalStorage();
  }

  uploadDataLocalStorage() {
    try {
      this.email = Number(this.localStorageService.decrypt(String(localStorage.getItem('e'))));
    } catch (error) {
      this.email = -1;
    }
    try {
      this.rol = Number(this.localStorageService.decrypt(String(localStorage.getItem('r'))));
    } catch (error) {
      this.rol = -1;
    }
    try {
      this.user = this.localStorageService.decrypt(String(localStorage.getItem('u')));
    } catch (error) {
      this.user = -1;
    }
  }

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
    return this.email;
  }

  getRol() {
    return this.rol;
  }

  getUser() {
    return this.user;
  }

}
