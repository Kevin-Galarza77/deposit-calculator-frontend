import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  password: string = 'LaNenita2024';

  encrypt(text: string): string {
    let encrypt = CryptoJS.AES.encrypt(text.trim(), this.password.trim()).toString();
    return encrypt;
  }

  decrypt(text: string): string {
    let decrypt = CryptoJS.AES.decrypt(text.trim(), this.password.trim()).toString(CryptoJS.enc.Utf8);
    return decrypt;
  }

}
