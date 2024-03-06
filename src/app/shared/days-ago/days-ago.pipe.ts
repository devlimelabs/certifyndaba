import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysAgo',
  standalone: true
})
export class DaysAgoPipe implements PipeTransform {

  transform(lastLoginDate: string | undefined): string {
    let daysAgo = '';

    if (lastLoginDate) {
      const lastLogin = new Date(lastLoginDate).getTime();
      const today = new Date().getTime();

      const timeDifference = today - lastLogin;

      const differenceInDays = timeDifference / (1000 * 3600 * 24);

      if (differenceInDays < 1) {
        return `Today`;
      }

      if (differenceInDays < 2) {
        return `Yesterday`;
      }

      daysAgo = `${Math.round(differenceInDays)} Days Ago`;
    }

    return daysAgo;
  }

}
