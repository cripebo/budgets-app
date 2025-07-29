import { Pipe, type PipeTransform } from '@angular/core';

enum DATE_TYPE {
  year = 'year',
  month = 'month',
  day = 'day',
  hour = 'hour',
  minute = 'minute',
  second = 'second',
}

const DATE_UNITS: { seconds: number; type: DATE_TYPE }[] = [
  { seconds: 31536000, type: DATE_TYPE.year },
  { seconds: 2629800, type: DATE_TYPE.month },
  { seconds: 86400, type: DATE_TYPE.day },
  { seconds: 3600, type: DATE_TYPE.hour },
  { seconds: 60, type: DATE_TYPE.minute },
  { seconds: 1, type: DATE_TYPE.second },
];

const LANGUAGE = 'es';

@Pipe({
  name: 'elapsedTime',
})
export class ElapsedTimePipe implements PipeTransform {
  transform(date: Date | string): string {
    let from: number = 0;

    if (date instanceof Date) {
      from = date.getTime();
    } else {
      from = new Date(date).getTime();
    }

    const now = new Date().getTime();
    const elapsedSeconds = (from - now) / 1000; // 1000 milisecons on 1 second

    for (const unit of DATE_UNITS) {
      if (Math.abs(elapsedSeconds) > unit.seconds) {
        return this.relativeTimeFormat().format(
          Math.floor(elapsedSeconds / unit.seconds),
          unit.type,
        );
      }
    }

    return this.relativeTimeFormat().format(0, 'second');
  }

  relativeTimeFormat = () => {
    return new Intl.RelativeTimeFormat(LANGUAGE, { numeric: 'auto' });
  };
}
