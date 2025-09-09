import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { PdfService } from '@core/services/download-pdf.service';
import { BudgetItemsState } from '@features/budgets/budget-items.state';
import { Budget } from '@features/budgets/models/budgets.model';
import { formatDateDDMMYYYY } from '@shared/utils/date-format';
import { downloadBlob } from '@shared/utils/file-downloader';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';

@Component({
  imports: [TableModule, ButtonModule, DatePipe, CurrencyPipe],
  template: `
    <div class="flex justify-end mb-4">
      <p-button
        label="Generar PDF"
        icon="pi pi-file-pdf"
        class="mt-1.5"
        aria-label="Generar PDF"
        [loading]="generating()"
        (onClick)="download()"
        styleClass="w-fit sm:w-50"
      />
    </div>
    <div #preview class="flex flex-col gap-12 px-8" ref="print">
      <section class="flex flex-col gap-4">
        <h1 class="font-semibold text-2xl">PRESUPUESTO</h1>
        <div>
          <p class="font-semibold">
            Fecha:
            <span class="font-normal">{{
              budget().created_at | date: 'd/MM/yyyy'
            }}</span>
          </p>
          <p class="font-semibold">
            Nº presupuesto: <span class="font-normal">{{ budget().id }}</span>
          </p>
        </div>
      </section>

      <section class="grid grid-cols-12">
        <div class="col-span-6 gap-2">
          <div class="flex flex-col gap-1">
            <h2 class="font-semibold text-xl border-b border-gray-300">
              {{ budget().company_name }}
            </h2>
            <h3 class="font-semibold text-base">
              NIF: <span class="font-normal">{{ budget().company_nif }}</span>
            </h3>
          </div>
          <div class="flex flex-col gap-0">
            <p class="font-semibold text-sm">
              Dirección:
              <span class="font-normal">{{ budget().company_address }}</span>
            </p>
            @if (budget().company_phone) {
              <p class="font-semibold text-sm">
                Teléfono:
                <span class="font-normal">{{ budget().company_phone }}</span>
              </p>
            }

            @if (budget().company_email) {
              <p class="font-semibold text-sm">
                E-Mail:
                <span class="font-normal">{{ budget().company_email }}</span>
              </p>
            }
          </div>
        </div>
        <div class="col-span-6 gap-2">
          <h2 class="font-semibold text-xl border-b border-gray-300">
            {{ budget().client_name }}
          </h2>

          <div class="flex flex-col gap-0">
            @if (budget().client_address) {
              <p class="font-semibold text-sm">
                Dirección:
                <span class="font-normal">{{ budget().client_address }}</span>
              </p>
            }

            @if (budget().client_phone) {
              <p class="font-semibold text-sm">
                Teléfono:
                <span class="font-normal">{{ budget().client_phone }}</span>
              </p>
            }

            @if (budget().client_email) {
              <p class="font-semibold text-sm">
                E-Mail:
                <span class="font-normal">{{ budget().client_email }}</span>
              </p>
            }
          </div>
        </div>
      </section>

      <section>
        <p-table
          showGridlines
          stripedRows
          [value]="budgetItems()"
          [tableStyle]="{ 'min-width': '50rem' }"
          [loading]="loading()"
          [showLoader]="false"
          size="small"
          responsiveLayout="scroll"
          styleClass="flexible-table"
        >
          <ng-template #header>
            <tr>
              <th class="w-8">Cantidad</th>
              <th class="w-36">Unidades</th>
              <th class="">Descripción</th>
              <th>Precio</th>
            </tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td>{{ item.quantity }}</td>
              <td>{{ item.unit }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.price | currency: 'EUR' : 'symbol' }}</td>
            </tr>
          </ng-template>

          <ng-template #loadingbody>
            <tr>
              <td [colSpan]="5">
                <div class="h-14 grid items-center justify-center">
                  <p class="flex flex-row items-center gap-2">
                    <i
                      class="pi pi-spin pi-spinner"
                      style="font-size: 1rem"
                    ></i>
                    <span>Cargando conceptos</span>
                  </p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </section>

      @if (budget().conditions) {
        <section class="min-h-24">
          <h3 class="border-b border-gray-300 font-semibold mb-2">
            Comentarios
          </h3>
          <p class="text-sm">{{ budget().conditions }}</p>
        </section>
      }

      <table
        id="preview-budget-price"
        class="ml-auto border border-gray-300 text-sm"
      >
        <tbody class="text-base">
          <tr class="border-b border-gray-300">
            <td class="px-4 py-2 w-64">Subtotal sin IVA</td>
            <td class="px-4 py-2 text-right">
              {{ budget().subtotal | currency: 'EUR' : 'symbol' }}
            </td>
          </tr>
          <tr class="border-b border-gray-300">
            <td class="px-4 py-2 w-40">IVA</td>
            <td class="px-4 py-2 text-right">{{ budget().iva }} %</td>
          </tr>
          <tr id="preview-budget-price-total" class="font-bold bg-gray-50">
            <td class="px-4 py-2 w-40">Total</td>
            <td class="px-4 py-2 text-right">
              {{ budget().total | currency: 'EUR' : 'symbol' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: `
    :host ::ng-deep .p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
      background: #e6f2ff !important;
    }

    #preview-budget-price #preview-budget-price-total {
      background: #e6f2ff !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetPreviewComponent {
  private readonly budgetItemsState = inject(BudgetItemsState);
  private readonly pdfService = inject(PdfService);
  readonly budget = input.required<Budget>();
  readonly generating = signal(false);

  readonly budgetItems = computed(() =>
    this.budgetItemsState.itemsForBudget(this.budget().id)(),
  );

  readonly loading = computed(() => {
    return !this.budgetItemsState.isLoaded(this.budget().id);
  });

  download() {
    this.generating.set(true);
    this.pdfService
      .downloadBudgetPdf(this.budget().id)
      .pipe(finalize(() => this.generating.set(false)))
      .subscribe((blob) => {
        const formattedDate = formatDateDDMMYYYY(this.budget().created_at);
        const pdfName = `presupuesto-${this.budget().id}-${formattedDate}.pdf`;
        downloadBlob(blob, pdfName);
      });
  }
}
