import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  password: string = 'LaNenita2024';

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text.trim(), this.password.trim()).toString();
  }

  decrypt(text: string): string {
    return CryptoJS.AES.decrypt(text.trim(), this.password.trim()).toString(CryptoJS.enc.Utf8);
  }

}
