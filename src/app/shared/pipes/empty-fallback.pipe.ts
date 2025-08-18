import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyFallback',
})
export class EmptyFallbackPipe implements PipeTransform {
  transform(value: string | null | undefined, fallback = '-'): string {
    if (!value || !value.trim().length) return fallback;
    return value;
  }
}
