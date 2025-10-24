import { Observable } from 'rxjs';

export interface ExportStrategy {
  export(entity: string, params?: Record<string, any>): Observable<Blob>;
}
