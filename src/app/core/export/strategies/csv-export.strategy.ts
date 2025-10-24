import { Observable } from 'rxjs';
import { ExportStrategy } from './base-export.strategy';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ExportFormat } from '../models/export-format.enum';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CsvExportStrategy implements ExportStrategy {
  private urlBase = environment.apiUrl;

  constructor(private http: HttpClient) {}

  export(entity: string): Observable<Blob> {
    const requestParams = new HttpParams().set('format', ExportFormat.CSV);
    const url = `${this.urlBase}/export/${entity}`;

    return this.http.get(url, { params: requestParams, responseType: 'blob' });
  }
}
