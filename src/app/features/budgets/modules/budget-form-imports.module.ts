import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    InputNumberModule,
    SelectModule,
  ],
  exports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    InputNumberModule,
    SelectModule,
  ],
})
export class FormsImportsModule {}
