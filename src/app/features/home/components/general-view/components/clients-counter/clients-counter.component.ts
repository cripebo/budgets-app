import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-clients-counter',
  imports: [],
  template: `<h2 class="text-xl font-semibold">
      <i class="pi pi-users text-amber-600" style="font-size: 1.1rem;"></i>
      Clientes
    </h2>
    <div>
      <p class="font-normal text-gray-600">
        {{ clientsCounter() }} registrados
      </p>
    </div>`,
  styleUrl: './clients-counter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsCounterComponent {
  clientsCounter = input(0);
}
