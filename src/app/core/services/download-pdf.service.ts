import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class PdfService {
  private urlBase = environment.apiUrl;

  constructor(private http: HttpClient) {}

  downloadBudgetPdf(budgetId: number) {
    const url = `${this.urlBase}/budgets/${budgetId}/pdf`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
