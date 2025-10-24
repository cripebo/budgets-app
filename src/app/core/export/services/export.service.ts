import { Injectable } from '@angular/core';
import { ExportStrategyFactory } from '../strategies/export-strategy.factory';
import { ExportFormat } from '../models/export-format.enum';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(private strategyFactory: ExportStrategyFactory) {}

  export(
    entity: string,
    format: ExportFormat,
    params?: Record<string, any>,
  ): Observable<Blob> {
    const strategy = this.strategyFactory.getStrategy(format);
    return strategy.export(entity, params);
  }
}
