import { inject, Injectable } from '@angular/core';
import { CsvExportStrategy } from './csv-export.strategy';
import { ExportFormat } from '../models/export-format.enum';
import { ExportStrategy } from './base-export.strategy';

@Injectable({ providedIn: 'root' })
export class ExportStrategyFactory {
  private csvStrategy = inject(CsvExportStrategy);

  getStrategy(format: ExportFormat): ExportStrategy {
    switch (format) {
      case ExportFormat.CSV:
        return this.csvStrategy;
      default:
        throw new Error(`Export format not supported: ${format}`);
    }
  }
}
