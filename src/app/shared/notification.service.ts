import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ValidationMessages } from '../core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  private fire(
  message: string,
  icon: SweetAlertIcon,
  title = '',
  showConfirm = true
) {
  Swal.fire({
    title,
    text: message,
    icon,
    confirmButtonText: 'OK',
    showConfirmButton: showConfirm,
    timer: showConfirm ? undefined : 2500, // auto-close if no confirm
    timerProgressBar: !showConfirm,
    allowOutsideClick: showConfirm,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  });
}


  success(messageKey: keyof typeof ValidationMessages, title?: string) {
    this.fire(ValidationMessages[messageKey], 'success', title);
  }

  error(messageKey: keyof typeof ValidationMessages, title?: string) {
    this.fire(ValidationMessages[messageKey], 'error', title);
  }

  warning(messageKey: keyof typeof ValidationMessages, title?: string) {
    this.fire(ValidationMessages[messageKey], 'warning', title);
  }

  info(messageKey: keyof typeof ValidationMessages, title?: string) {
    this.fire(ValidationMessages[messageKey], 'info', title);
  }
  confirmSuccess(messageKey: keyof typeof ValidationMessages, title?: string): Promise<boolean> {
  return Swal.fire({
    title: title || '',
    text: ValidationMessages[messageKey],
    icon: 'success',
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  }).then(r => r.isConfirmed);
}
}
