import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-side-content-info',
  imports: [],
  template: `
    <div class="flex flex-col gap-4">
      <p class="text-3xl sm:text-3xl font-bold leading-snug">
        Crea y gestiona presupuestos
      </p>

      <p class="text-xl sm:text-lg font-light leading-relaxed text-white/90">
        Crea, organiza y descarga tus presupuestos en PDF
      </p>

      <div class="flex flex-col gap-2 mt-3 text-white/80">
        <div class="flex items-start gap-2">
          <i class="pi pi-check mt-1.5" style="font-size: .8rem;"></i>
          <p class="text-base sm:text-base font-base">
            Crea presupuestos en minutos con conceptos reutilizables.
          </p>
        </div>
        <div class="flex items-start gap-2">
          <i class="pi pi-check mt-1.5" style="font-size: .8rem;"></i>
          <p class="text-base sm:text-base font-base">
            Personaliza los estados para adaptarlos a tu forma de trabajar.
          </p>
        </div>
        <div class="flex items-start gap-2">
          <i class="pi pi-check mt-1.5" style="font-size: .8rem;"></i>
          <p class="text-base sm:text-base font-base">
            Gestiona tus clientes fácilmente y mantén todo organizado.
          </p>
        </div>
        <div class="flex items-start gap-2">
          <i class="pi pi-check mt-1.5" style="font-size: .8rem;"></i>
          <p class="text-base sm:text-base font-base">
            Visualiza y descarga PDFs listos para enviar.
          </p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideContentInfoComponent {}
