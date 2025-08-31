import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

export abstract class ModalHandler {
  protected constructor(protected dialogService: DialogService) {}

  protected openModal<T>(
    component: any,
    options: {
      header?: string;
      inputValues?: Record<string, any>;
      width?: string;
      breakpoints?: Record<string, string>;
      maximizable?: boolean;
      focusOnShow?: boolean;
      onClose?: (result: T) => void;
    },
  ) {
    const defaultConfig: DynamicDialogConfig = {
      header: options.header,
      width: options.width ?? '50vw',
      breakpoints: options.breakpoints ?? {
        '1024px': '75vw',
        '640px': '80vw',
        '380px': '100%',
      },
      modal: true,
      closable: true,
      inputValues: options.inputValues,
    };

    const ref = this.dialogService.open(component, defaultConfig);

    if (options.onClose) {
      ref.onClose.pipe(take(1)).subscribe(options.onClose);
    }

    return ref;
  }
}
