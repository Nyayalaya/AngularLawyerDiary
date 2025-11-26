import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ValidationMessages } from '../core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  private show(message: string, icon: SweetAlertIcon = 'info', title: string = '') {
    Swal.fire({
      title: title || '',
      text: message,
      icon: icon,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    });
  }

  success(messageKey: keyof typeof ValidationMessages, title?: string) {
    this.show(ValidationMessages[messageKey], 'success', title);
  }

  error(messageKey: keyof typeof ValidationMessages, title?: string) {
    this.show(ValidationMessages[messageKey], 'error', title);
  }

  warning(messageKey: keyof typeof ValidationMessages, title?: string) {
    this.show(ValidationMessages[messageKey], 'warning', title);
  }

  info(messageKey: keyof typeof ValidationMessages, title?: string) {
    this.show(ValidationMessages[messageKey], 'info', title);
  }
}
