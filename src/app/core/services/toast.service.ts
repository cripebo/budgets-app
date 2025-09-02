import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export enum ToastSeverity {
  success = 'success',
  info = 'info',
  warn = 'warn',
  error = 'error',
  secondary = 'secondary',
  contrast = 'contrast',
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly KEY = 'global-toast';
  private readonly messageService = inject(MessageService);

  show(severity: ToastSeverity, title: string, message: string) {
    this.messageService.add({
      key: this.KEY,
      severity: severity,
      summary: title,
      detail: message,
    });
  }
}
