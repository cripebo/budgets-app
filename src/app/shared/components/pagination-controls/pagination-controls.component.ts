import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-pagination-controls',
  imports: [PaginatorModule],
  template: `
    <p-paginator
      (onPageChange)="onPageChange($event)"
      [first]="first()"
      [rows]="rows()"
      [totalRecords]="totalRecords()"
      [rowsPerPageOptions]="
        rowsPerPageOptions().length ? rowsPerPageOptions() : undefined
      "
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationControlsComponent {
  first = input<number>(0);
  rows = input<number>(10);
  totalRecords = input.required<number>();
  rowsPerPageOptions = input<number[]>([10, 20, 30]);

  pageChange = output<PaginatorState>();

  onPageChange(event: PaginatorState) {
    this.pageChange.emit(event);
  }
}
