import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {


  success(sms: string) {
    Swal.fire({ icon: "success", title: sms, showConfirmButton: false, timer: 1500 });
  }

  error(title: string, messages: string[]) {
    let html = '';
    if (messages.length !== 0) {
      messages.forEach((message: any) => {
        html += `<p> - ${message}</p>`
      });
    }
    Swal.fire({ icon: "error", title: title, html: html, confirmButtonColor: 'red' });
  }

  errorApplication() {
    Swal.fire({ icon: "error", title: 'Se produjo un error contacta al administrador', showConfirmButton: false, timer: 1500 });
  }

  async questionDelete() {
    const result = await Swal.fire({ title: "Estas seguro de realizar esta acción?", icon: "question", showCancelButton: true, confirmButtonText: "Eliminar", confirmButtonColor: 'rgb(220, 53, 69)', cancelButtonText: "Cancelar", cancelButtonColor: 'rgb(108, 117, 125)', reverseButtons: true })
    return result.isConfirmed;
  }

}
